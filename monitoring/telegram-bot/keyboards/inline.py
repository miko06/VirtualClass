from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from config import SERVER_IP


def main_menu():
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="📊 Статус сервисов", callback_data="services")],
            [InlineKeyboardButton(text="💾 Метрики сервера", callback_data="metrics")],
            [InlineKeyboardButton(text="🗄️ База данных", callback_data="database")],
            [InlineKeyboardButton(text="🔔 Активные алерты", callback_data="alerts")],
            [InlineKeyboardButton(text="🔄 Обновить", callback_data="refresh")],
        ]
    )


def back_button():
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="🔄 Обновить", callback_data="refresh")],
            [InlineKeyboardButton(text="◀️ Назад", callback_data="back")],
        ]
    )


def alert_detail(alertmanager_url: str):
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="📊 Посмотреть в Grafana",
                    url=f"http://{SERVER_IP}:3000",
                )
            ]
        ]
    )
