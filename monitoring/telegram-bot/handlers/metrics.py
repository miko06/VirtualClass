from datetime import datetime

from aiogram import Router, F
from aiogram.types import CallbackQuery

from keyboards.inline import back_button
from services.prometheus import PrometheusClient

router = Router()


def _progress_bar(value: float, segments: int = 10) -> str:
    filled = int(value / 100 * segments)
    empty = segments - filled
    return "█" * filled + "░" * empty


def _format_uptime(seconds: float) -> str:
    if seconds < 0:
        return "N/A"
    days = int(seconds // 86400)
    hours = int((seconds % 86400) // 3600)
    minutes = int((seconds % 3600) // 60)
    parts = []
    if days > 0:
        parts.append(f"{days}д")
    if hours > 0:
        parts.append(f"{hours}ч")
    parts.append(f"{minutes}м")
    return " ".join(parts)


@router.callback_query(F.data.in_(["metrics", "refresh"]))
async def show_metrics(callback: CallbackQuery):
    await callback.answer("Обновляем...")

    prom = PrometheusClient()
    cpu = await prom.get_cpu_usage()
    ram = await prom.get_memory_usage()
    disk = await prom.get_disk_usage()
    uptime = await prom.get_uptime()

    if cpu < 0 and ram < 0 and disk < 0:
        await callback.message.edit_text(
            "❌ Не удалось получить метрики.\nNode Exporter или Prometheus недоступен.",
            reply_markup=back_button(),
        )
        return

    now = datetime.now().strftime("%H:%M:%S")

    lines = [
        "<b>💻 Метрики сервера</b>",
        "━━━━━━━━━━━━━━━━━━",
        f"🖥️ CPU:    {cpu:5.1f}%  [<code>{_progress_bar(cpu)}</code>]",
        f"🧠 RAM:    {ram:5.1f}%  [<code>{_progress_bar(ram)}</code>]",
        f"💾 Диск:   {disk:5.1f}%  [<code>{_progress_bar(disk)}</code>]",
        f"⏱️ Uptime: {_format_uptime(uptime)}",
        "━━━━━━━━━━━━━━━━━━",
        f"🕐 {now}",
    ]

    await callback.message.edit_text(
        "\n".join(lines),
        reply_markup=back_button(),
        parse_mode="HTML",
    )
