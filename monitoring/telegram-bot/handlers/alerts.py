from datetime import datetime

from aiogram import Router, F
from aiogram.types import CallbackQuery

from keyboards.inline import back_button, alert_detail
from services.alertmanager import AlertmanagerClient

router = Router()


@router.callback_query(F.data == "alerts")
async def show_alerts(callback: CallbackQuery):
    am = AlertmanagerClient()
    alerts = await am.get_alerts()

    if not alerts:
        await callback.message.edit_text(
            "✅ <b>Все системы работают нормально</b>\n\nАктивных алертов нет.",
            reply_markup=back_button(),
            parse_mode="HTML",
        )
        await callback.answer()
        return

    active = [a for a in alerts if a.get("status", {}).get("state") == "active"]

    if not active:
        await callback.message.edit_text(
            "✅ <b>Все системы работают нормально</b>\n\nАктивных алертов нет.",
            reply_markup=back_button(),
            parse_mode="HTML",
        )
        await callback.answer()
        return

    lines = ["<b>🔔 Активные алерты</b>", "━━━━━━━━━━━━━━━━━━"]
    for a in active[:10]:
        labels = a.get("labels", {})
        annotations = a.get("annotations", {})
        name = labels.get("alertname", "Unknown")
        severity = labels.get("severity", "unknown")
        summary = annotations.get("summary", "")
        description = annotations.get("description", "")
        starts_at = a.get("startsAt", "")

        emoji = "🔴" if severity == "critical" else "🟡"
        lines.append(f"{emoji} <b>{name}</b>")
        if summary:
            lines.append(f"   📋 {summary}")
        if description:
            lines.append(f"   📊 {description}")
        lines.append(f"   ⚠️ Severity: {severity}")
        if starts_at:
            try:
                dt = datetime.fromisoformat(starts_at.replace("Z", "+00:00"))
                lines.append(f"   🕐 {dt.strftime('%H:%M:%S')}")
            except Exception:
                pass
        lines.append("")

    lines.append("━━━━━━━━━━━━━━━━━━")

    await callback.message.edit_text(
        "\n".join(lines),
        reply_markup=alert_detail(""),
        parse_mode="HTML",
    )
    await callback.answer()
