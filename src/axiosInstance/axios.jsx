import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/",
});

// Intercept request untuk menyertakan token
AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept response untuk menangani token kadaluarsa dan login gagal
AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        const token = localStorage.getItem("token");

        if (token) {
          // Jika token ada tetapi 401, artinya sesi kadaluarsa
          toast.error("Sesi telah berakhir. Silakan login kembali.");
          localStorage.removeItem("token");
          setTimeout(() => {
            window.location.href = "/login"; // Redirect ke login setelah notifikasi muncul
          }, 2000);
        } else {
          // Jika token tidak ada, berarti login gagal
          // toast.error("Login gagal. Periksa kembali email dan password Anda.");
        }
      }
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
