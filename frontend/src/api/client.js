const baseUrl = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const contentType = response.headers.get("content-type");
  const payload = contentType?.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null
        ? Array.isArray(payload.message)
          ? payload.message.join(", ")
          : payload.message || payload.error
        : payload;
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return payload;
}

export const usersApi = {
  list() {
    return request("/users");
  },
  create(data) {
    return request("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
