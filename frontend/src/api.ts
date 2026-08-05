import API_BASE from "./config";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();

  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const body = await response.text();

      throw new Error(
        `API ${response.status}: ${body || response.statusText}`
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return await response.json();
  } catch (err) {
    clearTimeout(timeout);
    console.error("API Error:", err);
    throw err;
  }
}

export const api = {
  //------------------------
  // Health
  //------------------------

  async health() {
    return request<{ status: string; db: boolean }>("/api/health");
  },

  //------------------------
  // Entries
  //------------------------

  async getEntries() {
    return request<Record<string, any>>("/api/entries");
  },

  async saveEntry(entry: any) {
    return request(`/api/entries/${entry.date}`, {
      method: "PUT",
      body: JSON.stringify(entry),
    });
  },

  async deleteEntry(date: string) {
    return request(`/api/entries/${date}`, {
      method: "DELETE",
    });
  },

  //------------------------
  // Settings
  //------------------------

  async getSettings() {
    return request("/api/settings");
  },

  async updateSettings(settings: any) {
    return request("/api/settings", {
      method: "PATCH",
      body: JSON.stringify(settings),
    });
  },
};

export default api;import API_BASE from "./config";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();

  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const body = await response.text();

      throw new Error(
        `API ${response.status}: ${body || response.statusText}`
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return await response.json();
  } catch (err) {
    clearTimeout(timeout);
    console.error("API Error:", err);
    throw err;
  }
}

export const api = {
  //------------------------
  // Health
  //------------------------

  async health() {
    return request<{ status: string; db: boolean }>("/api/health");
  },

  //------------------------
  // Entries
  //------------------------

  async getEntries() {
    return request<Record<string, any>>("/api/entries");
  },

  async saveEntry(entry: any) {
    return request(`/api/entries/${entry.date}`, {
      method: "PUT",
      body: JSON.stringify(entry),
    });
  },

  async deleteEntry(date: string) {
    return request(`/api/entries/${date}`, {
      method: "DELETE",
    });
  },

  //------------------------
  // Settings
  //------------------------

  async getSettings() {
    return request("/api/settings");
  },

  async updateSettings(settings: any) {
    return request("/api/settings", {
      method: "PATCH",
      body: JSON.stringify(settings),
    });
  },
};

export default api;
