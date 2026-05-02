import aiohttp
from config import ALERTMANAGER_URL


class AlertmanagerClient:
    def __init__(self):
        self.base_url = ALERTMANAGER_URL.rstrip("/")

    async def get_alerts(self) -> list:
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.base_url}/api/v1/alerts",
                    timeout=aiohttp.ClientTimeout(total=10),
                ) as resp:
                    if resp.status != 200:
                        return []
                    data = await resp.json()
                    return data.get("data", [])
        except Exception:
            return []
