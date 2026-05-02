from aiogram import Router, F
from aiogram.types import CallbackQuery

from keyboards.inline import graphs_menu

router = Router()


@router.callback_query(F.data == "graphs")
async def show_graphs(callback: CallbackQuery):
    await callback.message.edit_text(
        "<b>📈 Графики мониторинга (Grafana)</b>\n\n"
        "Выберите дашборд для просмотра:",
        reply_markup=graphs_menu(),
        parse_mode="HTML",
    )
    await callback.answer()
