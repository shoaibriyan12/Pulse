import API_BASE from "./config";

async function request(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  if (response.status === 204) return null;

  return response.json();
}

const api = {
  health() {
    return request("/api/health");
  },

  getEntries() {
    return request("/api/entries");
  },

  saveEntry(entry: any) {
    return request(`/api/entries/${entry.date}`, {
      method: "PUT",
      body: JSON.stringify(entry),
    });
  },

  deleteEntry(date: string) {
    return request(`/api/entries/${date}`, {
      method: "DELETE",
    });
  },

  getSettings() {
    return request("/api/settings");
  },

  updateSettings(settings: any) {
    return request("/api/settings", {
      method: "PATCH",
      body: JSON.stringify(settings),
    });
  },
};

export default api;
