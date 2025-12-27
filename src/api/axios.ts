import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// global interceptor to log user out when JWT expires/401 response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Don't intercept auth endpoints to avoid infinite loops
      const isAuthEndpoint = error.config?.url?.includes("/auth/");

      if (!isAuthEndpoint) {
        // Clear the cookie
        try {
          await api.post("/auth/logout");
        } catch { /* ignore logout errors */ }

        // Redirect to login
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
