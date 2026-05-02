from aiogram import Router, F
from aiogram.types import CallbackQuery

from keyboards.inline import back_button
from services.prometheus import PrometheusClient

router = Router()


def _format_size_bytes(size_bytes: float) -> str:
    if size_bytes < 0:
        return "N/A"
    for unit in ["B", "KB", "MB", "GB", "TB"]:
        if abs(size_bytes) < 1024:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024
    return f"{size_bytes:.1f} PB"


@router.callback_query(F.data == "database")
async def show_database(callback: CallbackQuery):
    prom = PrometheusClient()
    pg_data = await prom.get_postgres_status()

    if pg_data["pg_up"] < 0:
        await callback.message.edit_text(
            "❌ Не удалось получить метрики БД.\nPostgres Exporter или Prometheus недоступен.",
            reply_markup=back_button(),
        )
        await callback.answer()
        return

    status = "🟢 Online" if pg_data["pg_up"] == 1 else "🔴 Offline"

    lines = [
        "<b>🗄️ База данных</b>",
        "━━━━━━━━━━━━━━━━━━",
        f"📡 Статус:        {status}",
        f"🔗 Соединения:    {pg_data['backends']:.0f}",
        f"💿 Размер БД:     {_format_size_bytes(pg_data['db_size_bytes'])}",
        f"📝 Транзакции:    {pg_data['commits']:.0f}",
        "━━━━━━━━━━━━━━━━━━",
    ]

    await callback.message.edit_text(
        "\n".join(lines),
        reply_markup=back_button(),
        parse_mode="HTML",
    )
    await callback.answer()
