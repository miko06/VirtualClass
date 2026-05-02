from aiogram import Router, F
from aiogram.types import CallbackQuery

from keyboards.inline import back_button
from services.prometheus import PrometheusClient

router = Router()


@router.callback_query(F.data == "services")
async def show_services(callback: CallbackQuery):
    prom = PrometheusClient()
    services = await prom.get_up_status()

    if not services:
        await callback.message.edit_text(
            "❌ Не удалось получить статус сервисов.\nPrometheus недоступен.",
            reply_markup=back_button(),
        )
        await callback.answer()
        return

    lines = ["<b>📊 Статус сервисов</b>", "━━━━━━━━━━━━━━━━━━"]
    for s in services:
        icon = "🟢" if s["status"] == 1 else "🔴"
        status = "online" if s["status"] == 1 else "OFFLINE ⚠️"
        lines.append(f"{icon} <code>{s['job']:20s}</code> {status}")

    lines.append("━━━━━━━━━━━━━━━━━━")

    await callback.message.edit_text(
        "\n".join(lines),
        reply_markup=back_button(),
        parse_mode="HTML",
    )
    await callback.answer()
