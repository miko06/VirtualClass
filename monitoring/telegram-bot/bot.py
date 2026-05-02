import asyncio
import logging
import sys
from datetime import datetime

from aiohttp import web
from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.types import Message

from config import TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, SERVER_IP
from handlers import start, services, metrics, database, alerts, graphs
from keyboards.inline import alert_detail

logging.basicConfig(level=logging.INFO, stream=sys.stdout)
logger = logging.getLogger(__name__)

if not TELEGRAM_BOT_TOKEN:
    logger.error("TELEGRAM_BOT_TOKEN is not set! Bot will not start.")
    sys.exit(1)

bot = Bot(
    token=TELEGRAM_BOT_TOKEN,
    default=DefaultBotProperties(parse_mode=ParseMode.HTML),
)
dp = Dispatcher()

dp.include_router(start.router)
dp.include_router(services.router)
dp.include_router(metrics.router)
dp.include_router(database.router)
dp.include_router(alerts.router)
dp.include_router(graphs.router)


# Webhook endpoint for Alertmanager
async def handle_alertmanager_webhook(request: web.Request):
    try:
        data = await request.json()
        status = data.get("status", "")
        alerts_list = data.get("alerts", [])

        if not alerts_list:
            return web.json_response({"status": "ok"})

        for alert in alerts_list:
            labels = alert.get("labels", {})
            annotations = alert.get("annotations", {})
            name = labels.get("alertname", "Unknown")
            severity = labels.get("severity", "unknown")
            summary = annotations.get("summary", "")
            description = annotations.get("description", "")
            starts_at = alert.get("startsAt", "")

            emoji = "✅" if status == "resolved" else "🚨"
            status_text = "RESOLVED" if status == "resolved" else "ALERT"

            time_str = ""
            if starts_at:
                try:
                    dt = datetime.fromisoformat(starts_at.replace("Z", "+00:00"))
                    time_str = dt.strftime("%H:%M:%S")
                except Exception:
                    pass

            msg_lines = [
                f"{emoji} <b>{status_text}: {name}</b>",
                "━━━━━━━━━━━━━━━━━━━━",
            ]
            if summary:
                msg_lines.append(f"📋 {summary}")
            if description:
                msg_lines.append(f"📊 {description}")
            if time_str:
                msg_lines.append(f"🕐 Время: {time_str}")
            msg_lines.append(f"⚠️ Severity: {severity}")
            msg_lines.append("━━━━━━━━━━━━━━━━━━━━")

            try:
                await bot.send_message(
                    chat_id=TELEGRAM_CHAT_ID,
                    text="\n".join(msg_lines),
                    reply_markup=alert_detail(""),
                    parse_mode="HTML",
                )
            except Exception as e:
                logger.error(f"Failed to send Telegram alert: {e}")

        return web.json_response({"status": "ok"})
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return web.json_response({"status": "error", "message": str(e)}, status=500)


async def healthcheck(request: web.Request):
    return web.json_response({"status": "ok"})


async def main():
    app = web.Application()
    app.router.add_post("/webhook/alert", handle_alertmanager_webhook)
    app.router.add_get("/healthz", healthcheck)

    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, "0.0.0.0", 8080)

    # Start both the bot polling and the web server
    await asyncio.gather(
        dp.start_polling(bot),
        site.start(),
    )


if __name__ == "__main__":
    if not TELEGRAM_BOT_TOKEN:
        logger.error("TELEGRAM_BOT_TOKEN is not set!")
        sys.exit(1)
    asyncio.run(main())
