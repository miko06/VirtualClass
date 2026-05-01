#!/bin/sh
# n8n entrypoint wrapper: runs workflow init on first start, then starts n8n

DB="/home/node/.n8n/database.sqlite"
INIT_SCRIPT="/data/workflows/init-workflow.cjs"

if [ -f "$INIT_SCRIPT" ]; then
  # Check if workflow is already set up (database exists with active workflow)
  if [ -f "$DB" ]; then
    ACTIVE=$(node --experimental-sqlite -e "
      const { DatabaseSync } = require('node:sqlite');
      try {
        const db = new DatabaseSync('$DB');
        const wf = db.prepare(\"SELECT active FROM workflow_entity WHERE name = 'VirtualClass AI Assistant' AND activeVersionId IS NOT NULL\").get();
        db.close();
        process.exit(wf && wf.active ? 0 : 1);
      } catch(e) { process.exit(1); }
    " 2>/dev/null && echo "ok" || echo "")

    if [ "$ACTIVE" = "ok" ]; then
      echo "[entrypoint] Workflow already active, skipping init."
      exec n8n start
    fi
  fi

  echo "[entrypoint] First start or workflow not active — running init..."
  echo "[entrypoint] Starting n8n in background for DB setup..."
  n8n start &
  N8N_PID=$!

  # Wait for n8n health
  for i in $(seq 1 40); do
    if wget -qO- http://localhost:5678/healthz 2>/dev/null; then
      echo "[entrypoint] n8n is ready"
      break
    fi
    echo "[entrypoint] waiting for n8n... ($i/40)"
    sleep 2
  done

  # Run init
  echo "[entrypoint] Running workflow init..."
  node "$INIT_SCRIPT" || echo "[entrypoint] Init script completed (see above for status)"

  # Stop background n8n
  echo "[entrypoint] Stopping background n8n..."
  kill $N8N_PID 2>/dev/null
  wait $N8N_PID 2>/dev/null
  sleep 2

  echo "[entrypoint] Starting n8n..."
  exec n8n start
else
  echo "[entrypoint] No init script found, starting n8n directly."
  exec n8n start
fi
