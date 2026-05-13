const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  },

  auth: {
    registerEmail: (data: { email: string; password: string; name?: string; role?: string }) =>
      api.request("/auth/register/email", { method: "POST", body: JSON.stringify(data) }),
    loginEmail: (data: { email: string; password: string }) =>
      api.request("/auth/login/email", { method: "POST", body: JSON.stringify(data) }),
    loginGoogle: (data: { googleId: string; email?: string; name?: string; photoURL?: string }) =>
      api.request("/auth/login/google", { method: "POST", body: JSON.stringify(data) }),
    loginGuest: () => api.request("/auth/login/guest", { method: "POST" }),
    updateProfile: (data: { name: string; photoURL?: string }) =>
      api.request("/auth/profile", { method: "PUT", body: JSON.stringify(data) }),
  },

  user: {
    getProfile: () => api.request("/users/me"),
    updateProfile: (data: { name: string }) =>
      api.request("/users/profile", { method: "PUT", body: JSON.stringify(data) }),
    updatePhoto: (formData: FormData) =>
      api.request("/users/photo", { method: "PUT", body: formData, headers: {} }),
  },

  categories: {
    getAll: () => api.request("/categories"),
    create: (data: any) => api.request("/categories", { method: "POST", body: JSON.stringify(data) }),
  },

  templates: {
    getAll: (categoryId?: string) =>
      api.request(categoryId ? `/templates?categoryId=${categoryId}` : "/templates"),
    getById: (id: string) => api.request(`/templates/${id}`),
    create: (data: any) => api.request("/templates", { method: "POST", body: JSON.stringify(data) }),
  },

  share: {
    record: (data: any) => api.request("/share", { method: "POST", body: JSON.stringify(data) }),
    getHistory: () => api.request("/share/history"),
  },

  subscriptions: {
    createOrder: () => api.request("/subscriptions/create-order", { method: "POST" }),
    verifyPayment: (data: any) =>
      api.request("/subscriptions/verify-payment", { method: "POST", body: JSON.stringify(data) }),
    getStatus: () => api.request("/subscriptions/status"),
  },
};
