import io
from datetime import datetime

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm

from aiogram import Router, F, Bot
from aiogram.types import CallbackQuery, BufferedInputFile

from services.prometheus import PrometheusClient

router = Router()

plt.style.use("dark_background")
plt.rcParams.update({"font.size": 10, "axes.titlesize": 13, "axes.labelsize": 11})


async def _send_plot(callback: CallbackQuery, title: str, labels: list, values: list, ylabel: str = "%"):
    fig, ax = plt.subplots(figsize=(8, 5))
    colors = ["#3498db", "#e74c3c", "#2ecc71", "#f39c12", "#9b59b6", "#1abc9c"]
    bars = ax.bar(labels, values, color=colors[:len(labels)], edgecolor="white", linewidth=0.5)

    for bar, val in zip(bars, values):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.5,
                f"{val:.1f}{ylabel}", ha="center", va="bottom", fontsize=11, fontweight="bold", color="white")

    ax.set_title(title, pad=15, fontweight="bold")
    ax.set_ylabel(ylabel)
    ax.set_ylim(0, max(max(values) * 1.25, 10))
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.tick_params(colors="white")
    ax.yaxis.grid(True, alpha=0.3)

    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight", dpi=100, facecolor="#1e1e1e")
    plt.close(fig)
    buf.seek(0)

    await callback.message.answer_photo(
        BufferedInputFile(buf.read(), filename="chart.png"),
        caption=f"📸 {title}\n🕐 {datetime.now().strftime('%H:%M:%S')}",
    )
    await callback.answer()


@router.callback_query(F.data == "scr_node")
async def screenshot_node(callback: CallbackQuery):
    prom = PrometheusClient()
    cpu = await prom.get_cpu_usage()
    ram = await prom.get_memory_usage()
    disk = await prom.get_disk_usage()
    uptime = await prom.get_uptime()

    if cpu < 0:
        await callback.answer("Данные недоступны", show_alert=True)
        return

    labels = ["CPU", "RAM", "Disk"]
    values = [cpu, ram, disk]

    days = int(uptime // 86400) if uptime > 0 else 0
    hours = int((uptime % 86400) // 3600) if uptime > 0 else 0
    uptime_str = f"{days}d {hours}h" if uptime > 0 else "N/A"

    await _send_plot(
        callback,
        f"Node Exporter / Система (Uptime: {uptime_str})",
        labels, values,
    )


@router.callback_query(F.data == "scr_postgres")
async def screenshot_postgres(callback: CallbackQuery):
    prom = PrometheusClient()
    pg_data = await prom.get_postgres_status()

    if pg_data["pg_up"] < 0:
        await callback.answer("Данные недоступны", show_alert=True)
        return

    db_size_mb = pg_data["db_size_bytes"] / (1024 * 1024) if pg_data["db_size_bytes"] > 0 else 0
    backends = pg_data["backends"] if pg_data["backends"] > 0 else 0
    commits_per_s = pg_data["commits"] if pg_data["commits"] > 0 else 0

    labels = ["Size (MB)", "Backends", "Commits/s"]
    values = [db_size_mb, backends, commits_per_s]

    await _send_plot(
        callback,
        "PostgreSQL / База данных",
        labels, values,
        ylabel="value",
    )


@router.callback_query(F.data == "scr_nginx")
async def screenshot_nginx(callback: CallbackQuery):
    prom = PrometheusClient()
    req_total = await prom._query('rate(nginx_http_requests_total[1m])')

    if "error" in req_total or not req_total.get("result"):
        await callback.message.edit_text(
            "⚠️ Nginx Exporter не настроен.\n\n"
            "Установите <code>nginx-prometheus-exporter</code> и добавьте его в Prometheus.",
            parse_mode="HTML",
            reply_markup=callback.message.reply_markup,
        )
        await callback.answer("Nginx exporter не найден", show_alert=True)
        return

    await _send_plot(callback, "Nginx / Веб-сервер", ["Requests/s"], [0])
