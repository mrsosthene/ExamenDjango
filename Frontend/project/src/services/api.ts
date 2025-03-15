import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // URL de base
});

// 2) Intercepteur de requêtes : insère le token d'accès
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3) Intercepteur de réponses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // a) Si c’est une 401 je tente un refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          // Pas de refreshToken => je redirige direct
          window.location.href = "/login";
          return Promise.reject(error);
        }
        // b) Appel à /api/token/refresh/ avec le refresh
        const res = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          { refresh: refreshToken }
        );
        // c)nouvel Access Token
        const newAccessToken = res.data.access;
        // d) Sctockage
        localStorage.setItem("token", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        // Le refresh a échoué
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
