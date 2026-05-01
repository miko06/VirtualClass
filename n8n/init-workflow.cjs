#!/usr/bin/env node

const { execSync } = require("child_process");
const { DatabaseSync } = require("node:sqlite");
const fs = require("fs");
const crypto = require("crypto");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const DB_PATH = "/home/node/.n8n/database.sqlite";
const WORKFLOW_TEMPLATE = "/data/workflows/virtualclass-ai-workflow.json";
const WORKFLOW_NAME = "VirtualClass AI Assistant";
const CREDENTIAL_NAME = "OpenRouter Auth";

function log(msg) {
  const ts = new Date().toISOString().slice(11, 19);
  process.stderr.write(`[${ts}] ${msg}\n`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function execN8n(args) {
  return execSync(`n8n ${args}`, {
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "pipe"],
  });
}

async function waitForN8nDB() {
  for (let i = 1; i <= 60; i++) {
    try {
      const db = new DatabaseSync(DB_PATH);
      db.prepare("SELECT activeVersionId FROM workflow_entity LIMIT 0").all();
      db.close();
      log("n8n database ready (migrations complete)");
      return true;
    } catch {
      // Column not ready yet (migrations still running)
    }
    log(`database migrations not ready yet (attempt ${i}/60)`);
    await sleep(2000);
  }
  return false;
}

function dbFileExists() {
  return fs.existsSync(DB_PATH);
}

async function main() {
  log("n8n init workflow — starting");

  if (!OPENAI_API_KEY) {
    log("SKIP: OPENAI_API_KEY is not set");
    process.exit(0);
  }

  // Wait for n8n to create the database (n8n might still be starting up)
  const dbReady = await waitForN8nDB();
  if (!dbReady) {
    log("FAILED: database did not appear in time");
    process.exit(1);
  }

  const db = new DatabaseSync(DB_PATH);

  // Check if workflow already exists and is active with a published version
  const existing = db.prepare(
    "SELECT id, active, activeVersionId FROM workflow_entity WHERE name = ?",
  ).get(WORKFLOW_NAME);

  if (existing && existing.active && existing.activeVersionId) {
    log(`Workflow "${WORKFLOW_NAME}" already active and published (id=${existing.id}), nothing to do.`);
    db.close();
    process.exit(0);
  }

  let wfId = existing?.id;

  if (!existing) {
    // --- Import credential ---
    let credId = db.prepare(
      "SELECT id FROM credentials_entity WHERE name = ?",
    ).get(CREDENTIAL_NAME)?.id;

    if (!credId) {
      credId = crypto.randomUUID();

      const credsJson = JSON.stringify([
        {
          id: credId,
          name: CREDENTIAL_NAME,
          type: "httpHeaderAuth",
          data: {
            name: "Authorization",
            value: `Bearer ${OPENAI_API_KEY}`,
          },
        },
      ]);

      const tmpCredFile = "/tmp/n8n-init-creds.json";
      fs.writeFileSync(tmpCredFile, credsJson);

      log("Importing credentials...");
      execN8n(`import:credentials --input=${tmpCredFile}`);
      log(`Credential imported (id=${credId}).`);

      fs.unlinkSync(tmpCredFile);
    } else {
      log(`Credential already exists (id=${credId}), reusing.`);

      // Update credential data in case API key changed
      const data = JSON.stringify({
        name: "Authorization",
        value: `Bearer ${OPENAI_API_KEY}`,
      });
      db.prepare("UPDATE credentials_entity SET data = ? WHERE id = ?").run(data, credId);
      log("Credential data updated.");
    }

    // --- Import workflow ---
    const raw = fs.readFileSync(WORKFLOW_TEMPLATE, "utf-8");
    const workflow = JSON.parse(raw);

    for (const node of workflow.nodes || []) {
      if (node.credentials?.httpHeaderAuth) {
        node.credentials.httpHeaderAuth.id = credId;
        node.credentials.httpHeaderAuth.name = CREDENTIAL_NAME;
      }
    }

    const tmpWfFile = "/tmp/n8n-init-workflow.json";
    fs.writeFileSync(tmpWfFile, JSON.stringify(workflow, null, 2));

    log("Importing workflow...");
    execN8n(`import:workflow --input=${tmpWfFile}`);
    log("Workflow imported.");

    fs.unlinkSync(tmpWfFile);

    // Get the imported workflow ID
    const wf = db.prepare(
      "SELECT id FROM workflow_entity WHERE name = ? ORDER BY createdAt DESC LIMIT 1",
    ).get(WORKFLOW_NAME);

    if (!wf) {
      log("FAILED: workflow not found after import");
      db.close();
      process.exit(1);
    }

    wfId = wf.id;
  }

  // --- Publish workflow (creates activeVersionId) ---
  if (existing && !existing.activeVersionId) {
    log("Publishing workflow...");
    execN8n(`publish:workflow --id=${wfId}`);
    log("Workflow published.");
  } else if (!existing) {
    log("Publishing workflow...");
    execN8n(`publish:workflow --id=${wfId}`);
    log("Workflow published.");
  }

  // --- Activate workflow ---
  log(`Activating workflow (id=${wfId})...`);
  db.prepare("UPDATE workflow_entity SET active = 1 WHERE id = ?").run(wfId);
  db.close();

  log("Workflow activated.");
  log("n8n init workflow — complete");
  log("NOTE: n8n must be restarted for changes to take effect.");
}

main().catch((err) => {
  log(`FATAL: ${err.message}`);
  process.exit(1);
});
