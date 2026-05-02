import aiohttp
from config import PROMETHEUS_URL


class PrometheusClient:
    def __init__(self):
        self.base_url = PROMETHEUS_URL.rstrip("/")

    async def _query(self, query: str) -> dict:
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.base_url}/api/v1/query",
                    params={"query": query},
                    timeout=aiohttp.ClientTimeout(total=10),
                ) as resp:
                    if resp.status != 200:
                        return {"error": f"Prometheus returned status {resp.status}"}
                    data = await resp.json()
                    return data.get("data", {})
        except Exception as e:
            return {"error": str(e)}

    async def get_up_status(self) -> list:
        result = await self._query("up")
        if "error" in result:
            return []
        items = []
        for r in result.get("result", []):
            items.append({
                "job": r["metric"].get("job", "unknown"),
                "instance": r["metric"].get("instance", "unknown"),
                "status": int(float(r["value"][1])) if r.get("value") else 0,
            })
        return items

    async def get_cpu_usage(self) -> float:
        result = await self._query(
            '100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)'
        )
        if "error" in result:
            return -1
        results = result.get("result", [])
        if results:
            return float(results[0].get("value", [0, 0])[1])
        return -1

    async def get_memory_usage(self) -> float:
        result = await self._query(
            '(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100'
        )
        if "error" in result:
            return -1
        results = result.get("result", [])
        if results:
            return float(results[0].get("value", [0, 0])[1])
        return -1

    async def get_disk_usage(self) -> float:
        result = await self._query(
            '(1 - node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100'
        )
        if "error" in result:
            return -1
        results = result.get("result", [])
        if results:
            return float(results[0].get("value", [0, 0])[1])
        return -1

    async def get_uptime(self) -> float:
        result = await self._query("node_time_seconds - node_boot_time_seconds")
        if "error" in result:
            return -1
        results = result.get("result", [])
        if results:
            return float(results[0].get("value", [0, 0])[1])
        return -1

    async def get_postgres_status(self) -> dict:
        pg_up = await self._query("pg_up")
        backends = await self._query("pg_stat_database_numbackends")
        db_size = await self._query('pg_database_size_bytes{datname="vc"}')
        commits = await self._query("pg_stat_database_xact_commit")

        return {
            "pg_up": self._extract_first(pg_up),
            "backends": self._extract_first(backends),
            "db_size_bytes": self._extract_first(db_size),
            "commits": self._extract_first(commits),
        }

    async def get_nginx_metrics(self) -> dict:
        active = await self._query("nginx_connections_active")
        requests = await self._query("rate(nginx_http_requests_total[1m])")
        handled = await self._query("rate(nginx_http_requests_total[1m])")

        return {
            "active_conn": self._extract_first(active),
            "requests_rate": self._extract_first(requests),
            "handled_rate": self._extract_first(handled),
        }

    def _extract_first(self, data: dict) -> float:
        if "error" in data:
            return -1
        results = data.get("result", [])
        if results:
            return float(results[0].get("value", [0, 0])[1])
        return -1
