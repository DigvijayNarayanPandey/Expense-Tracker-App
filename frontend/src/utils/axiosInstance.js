import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    // If the body is FormData, let the browser set Content-Type automatically
    // (it needs to include the multipart boundary — a hardcoded JSON header breaks this)
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const requestConfig = error.config || {};
    const isTimeoutOrNetworkError =
      error.code === "ECONNABORTED" || error.code === "ERR_NETWORK";
    const isLoginRequest = (requestConfig.url || "").includes(
      "/api/v1/auth/login",
    );

    // Retry login once for cold starts/network hiccups and inform the user.
    if (isTimeoutOrNetworkError && isLoginRequest && !requestConfig._retry) {
      requestConfig._retry = true;
      toast.loading("Server is waking up, retrying...", {
        id: "server-wakeup",
      });

      await new Promise((resolve) => setTimeout(resolve, 2500));

      try {
        const retriedResponse = await axiosInstance(requestConfig);
        toast.dismiss("server-wakeup");
        return retriedResponse;
      } catch (retryError) {
        toast.dismiss("server-wakeup");
        return Promise.reject(retryError);
      }
    }

    // Handle common errors globally
    if (error.response) {
      if (error.response.status === 401) {
        // Redirect to login page
        window.location.href = "/login";
      } else if (error.response.status === 500) {
        console.log("Server error. Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.log(
        `Request timeout (${axiosInstance.defaults.timeout}ms): ${error.config?.baseURL || BASE_URL}${error.config?.url || ""}`,
      );
      toast.error("Server took too long to respond. Please try again.");
    } else if (error.code === "ERR_NETWORK") {
      console.log(
        `Network error: unable to reach API at ${error.config?.baseURL || BASE_URL}. Check internet/API server/CORS.`,
      );
      toast.error("Network error. Please check your connection and try again.");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
