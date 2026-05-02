from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from aiogram.filters import CommandStart

from keyboards.inline import main_menu

router = Router()


@router.message(CommandStart())
async def cmd_start(message: Message):
    await message.answer(
        "👋 <b>Добро пожаловать в VirtualClass Monitoring Bot!</b>\n\n"
        "Я помогаю отслеживать состояние серверов и сервисов VirtualClass.\n"
        "Выберите действие из меню ниже:",
        reply_markup=main_menu(),
        parse_mode="HTML",
    )


@router.callback_query(F.data == "back")
async def back_to_menu(callback: CallbackQuery):
    await callback.message.edit_text(
        "👋 <b>VirtualClass Monitoring</b>\n\n"
        "Выберите действие из меню:",
        reply_markup=main_menu(),
        parse_mode="HTML",
    )
    await callback.answer()
