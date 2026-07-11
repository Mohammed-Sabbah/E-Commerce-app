import axios from "axios";
import Cookies from "js-cookie";

export const apiClient = axios.create({
    baseURL: "",
    withCredentials: true,
    timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
    const locale = Cookies.get("NEXT_LOCALE") || "en";
    config.params = { ...config.params, lang: locale };
    return config;
});