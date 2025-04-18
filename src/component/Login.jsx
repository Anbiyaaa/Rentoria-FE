import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../navigation/Navbar";
import Footer from "./Footer";
import { AxiosInstance } from "../axiosInstance/axios";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsExiting(true);

    try {
      const response = await AxiosInstance.post("/api/login", { email, password });
      const token = response.data.token;

      if (response.data.success && response.data.user) {
        const { role } = response.data.user;
        let userRole = role === "admin" ? "admin" : "customer";
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("token", token);
        localStorage.setItem("showLoginSuccess", "true");
        localStorage.setItem('userId', response.data.user.id);

        setTimeout(() => {
          navigate(userRole === "admin" ? "/dashboardAdmin" : "/dashboardUser");
        }, 500);
      } else {
        toast.error(response.data.message || "Login gagal! Data pengguna tidak ditemukan.");
        setIsExiting(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login gagal!");
      setIsExiting(false);
    }
  };

  const handleGoogleLogin = () => {
    // Implementasi login dengan Google akan ditambahkan di sini
    // Biasanya menggunakan OAuth atau Firebase Authentication
    toast.info("Login dengan Google akan segera tersedia!");
  };

  return (
    <>
      <Navbar />
      <Toaster />
      <div className="flex items-center justify-center min-h-screen bg-stone-800 font-poppins">
        {/* Desktop Layout */}
        <motion.div
          className="hidden md:flex w-350 h-150"
          initial={{ opacity: 1, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-2/3 bg-[#0D0D0D] flex flex-col justify-center items-center p-8 rounded-l-4xl relative"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute top-8 left-5 flex items-center text-2xl font-bold text-white">
              <img src="/Logo R 3.png" height="40" width="40" alt="Logo Rentoria" />
              <span className="mt-4">entoria</span>
            </div>
            <h2 className="text-4xl font-bold text-lime-500 mb-8">Masuk Ke Rentoria</h2>
            <form onSubmit={handleSubmit} className="w-3/4">
              <motion.div
                className="mb-4 flex items-center bg-[#1A1A1A] p-3 rounded-lg shadow border border-gray-800"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <FaEnvelope className="mr-3 text-lime-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan Email"
                  className="w-full outline-none bg-transparent text-white"
                  required
                />
              </motion.div>

              <motion.div
                className="mb-4 flex items-center bg-[#1A1A1A] p-3 rounded-lg shadow border border-gray-800"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.9 }}
              >
                <FaLock className="mr-3 text-lime-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan Password"
                  className="w-full outline-none bg-transparent text-white"
                  required
                />
              </motion.div>

              <div className="flex items-center mt-6 mb-6">
                <hr className="flex-grow border-gray-800" />
                <span className="mx-3 text-gray-400">ATAU</span>
                <hr className="flex-grow border-gray-800" />
              </div>

              <motion.button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full h-13 bg-[#1A1A1A] text-white flex items-center justify-center p-3 rounded-full shadow hover:bg-lime-500 hover:text-black cursor-pointer border border-gray-800"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.1 }}
              >
                <img
                  src="/images/google-logo.png"
                  alt="Google"
                  className="w-6 h-6 mr-2"
                />
                <span className="text-lg">Google</span>
              </motion.button>

              <div className="flex flex-col items-center justify-center mt-6">
                <motion.button
                  type="submit"
                  className="w-full h-16 bg-lime-500 text-black text-xl p-4 mt-4 rounded-full shadow-lg hover:bg-lime-600 cursor-pointer"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1.2 }}
                >
                  Masuk
                </motion.button>
              </div>
            </form>
          </motion.div>

          <motion.div
            className="w-1/3 bg-[#1A1A1A] flex flex-col justify-center items-center rounded-r-4xl text-white p-12"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-[44px] font-bold mb-4 text-center text-lime-500">Selamat Datang Di Rentoria</h2>
            <p className="text-center font-semibold mb-8 text-gray-300">Masukkan detail pribadi Anda dan mulailah perjalanan bersama kami</p>
            <Link to="/register">
              <button className="border border-lime-500 text-xl px-32 py-3 rounded-full hover:bg-lime-500 text-white hover:text-black transition cursor-pointer">
                Daftar
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Mobile Layout */}
        <motion.div
          className="md:hidden w-full max-w-md px-6 py-8"
          initial={{ opacity: 1, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-[#0D0D0D] rounded-3xl p-8 shadow-lg">
            <div className="flex justify-center items-center mb-8">
              <div className="flex items-center text-2xl font-bold text-white">
                <img src="/Logo R 3.png" height="40" width="40" alt="Logo Rentoria" />
                <span className="mt-4">entoria</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-lime-500 mb-8 text-center">Masuk Ke Rentoria</h2>
            <form onSubmit={handleSubmit} className="w-full">
              <motion.div
                className="mb-4 flex items-center bg-[#1A1A1A] p-3 rounded-lg shadow border border-gray-800"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <FaEnvelope className="mr-3 text-lime-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan Email"
                  className="w-full outline-none bg-transparent text-white"
                  required
                />
              </motion.div>

              <motion.div
                className="mb-4 flex items-center bg-[#1A1A1A] p-3 rounded-lg shadow border border-gray-800"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.9 }}
              >
                <FaLock className="mr-3 text-lime-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan Password"
                  className="w-full outline-none bg-transparent text-white"
                  required
                />
              </motion.div>

              <div className="flex items-center mt-6 mb-4">
                <hr className="flex-grow border-gray-800" />
                <span className="mx-3 text-gray-400">ATAU</span>
                <hr className="flex-grow border-gray-800" />
              </div>

              <motion.button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full h-12 bg-[#1A1A1A] text-white flex items-center justify-center p-3 rounded-full shadow hover:bg-lime-500 hover:text-black cursor-pointer border border-gray-800 mb-4"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.1 }}
              >
                <img
                  src="/images/google-logo.png"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                <span className="text-base">Masuk dengan Google</span>
              </motion.button>

              <div className="flex flex-col items-center justify-center mt-4">
                <motion.button
                  type="submit"
                  className="w-full h-14 bg-lime-500 text-black text-lg p-4 rounded-full shadow-lg hover:bg-lime-600 cursor-pointer"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1.2 }}
                >
                  Masuk
                </motion.button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <h3 className="text-xl font-bold text-lime-500 mb-4">Selamat Datang Di Rentoria</h3>
              <p className="text-sm font-semibold mb-6 text-gray-300">Masukkan detail pribadi Anda dan mulailah perjalanan bersama kami</p>
              <Link to="/register">
                <button className="w-full border border-lime-500 text-lg py-3 rounded-full hover:bg-lime-500 font-semibold text-white hover:text-black transition cursor-pointer">
                  Daftar
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default Login;