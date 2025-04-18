import { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../navigation/Navbar";
import Footer from "./Footer";
import axios from "../axiosInstance/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    try {
      await axios.post("/api/register", formData);
      toast.success("Registrasi berhasil! Silakan login.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      toast.error("Registrasi gagal. Periksa kembali data Anda!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="flex items-center justify-center min-h-screen bg-stone-800 font-poppins py-8 px-4">
        {/* Desktop Layout (2 columns) */}
        <motion.div
          className="hidden md:flex w-350 h-150"
          initial={{ opacity: 1, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          {/* Bagian kiri */}
          <motion.div
            className="w-1/3 bg-[#1A1A1A] flex flex-col items-center justify-center text-white p-10 rounded-l-3xl relative z-20"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute top-8 left-5 flex items-center text-2xl font-bold text-white">
              <img src="/Logo R 3.png" height="40" width="40" alt="Logo Rentoria" />
              <span className="mt-4 text-lime-500">entoria</span>
            </div>
            <h2 className="text-[44px] font-bold text-center text-white">Selamat Datang Kembali</h2>
            <p className="w-50 text-center mt-3 font-semibold text-gray-300">
              Untuk tetap terhubung dengan kami, silakan login dengan informasi pribadi Anda
            </p>
            <Link to="/login">
              <button className="mt-6 px-24 py-4 border-2 border-lime-500 rounded-full font-semibold text-white hover:bg-lime-500 hover:text-black transition">
                Masuk
              </button>
            </Link>
          </motion.div>

          <motion.div
            className="w-2/3 bg-[#0D0D0D] flex flex-col justify-center items-center p-10 rounded-r-3xl"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-5xl font-bold mb-16 text-lime-500">Daftar Ke Rentoria</h2>
            <form onSubmit={handleSubmit} className="w-120">
              <motion.div
                className="mb-4 flex items-center bg-[#1A1A1A] text-white px-3 rounded-lg shadow border border-gray-800"
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <FaUser className="text-lime-500" />
                <input
                  type="text"
                  placeholder="Nama"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-lg outline-none bg-[#1A1A1A] text-white"
                  required
                />
              </motion.div>

              <motion.div
                className="mb-4 flex items-center bg-[#1A1A1A] text-white px-3 rounded-lg shadow border border-gray-800"
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.9 }}
              >
                <FaEnvelope className="text-lime-500" />
                <input
                  type="email"
                  placeholder="Masukkan Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg outline-none bg-[#1A1A1A] text-white"
                  required
                />
              </motion.div>

              <motion.div
                className="mb-4 flex items-center bg-[#1A1A1A] text-white px-3 rounded-lg shadow border border-gray-800"
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <FaLock className="text-lime-500" />
                <input
                  type="password"
                  placeholder="Masukkan Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-lg outline-none bg-[#1A1A1A] text-white"
                  required
                />
              </motion.div>

              <div className="flex items-center mt-10 mb-6">
                <hr className="flex-grow border-gray-800" />
                <span className="mx-3 text-gray-400">ATAU</span>
                <hr className="flex-grow border-gray-800" />
              </div>

              <div className="flex flex-col items-center justify-center">
                <motion.button
                  className="w-90 h-13 bg-[#1A1A1A] text-white flex items-center justify-center p-3 rounded-full shadow hover:bg-lime-500 hover:text-black cursor-pointer border border-gray-800"
                  initial={{ x: -200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1.2 }}
                >
                  <img
                    src="/images/google-logo.png"
                    alt="Google"
                    className="w-6 h-6 mr-2"
                  />
                  <span className="text-lg">Google</span>
                </motion.button>

                <motion.button
                  type="submit"
                  className="w-70 h-16 bg-lime-500 text-black text-xl p-4 mt-6 rounded-full shadow-lg hover:bg-lime-600 cursor-pointer"
                  initial={{ x: -200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1.3 }}
                >
                  Daftar
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>

        {/* Mobile Layout (single column) */}
        <motion.div
          className="md:hidden w-full max-w-md"
          initial={{ opacity: 1, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-[#0D0D0D] rounded-3xl p-6 shadow-lg">
            <div className="flex justify-center items-center mb-6">
              <div className="flex items-center text-xl font-bold text-white">
                <img src="/Logo R 3.png" height="40" width="40" alt="Logo Rentoria" />
                <span className="mt-4 text-lime-500">entoria</span>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-8 text-lime-500 text-center">
              Daftar Ke Rentoria
            </h2>
            
            <form onSubmit={handleSubmit} className="w-full">
              <motion.div
                className="mb-4 flex items-center bg-[#1A1A1A] text-white px-3 rounded-lg shadow border border-gray-800"
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <FaUser className="text-lime-500" />
                <input
                  type="text"
                  placeholder="Nama"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-lg outline-none bg-[#1A1A1A] text-white"
                  required
                />
              </motion.div>

              <motion.div
                className="mb-4 flex items-center bg-[#1A1A1A] text-white px-3 rounded-lg shadow border border-gray-800"
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.9 }}
              >
                <FaEnvelope className="text-lime-500" />
                <input
                  type="email"
                  placeholder="Masukkan Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg outline-none bg-[#1A1A1A] text-white"
                  required
                />
              </motion.div>

              <motion.div
                className="mb-4 flex items-center bg-[#1A1A1A] text-white px-3 rounded-lg shadow border border-gray-800"
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <FaLock className="text-lime-500" />
                <input
                  type="password"
                  placeholder="Masukkan Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-lg outline-none bg-[#1A1A1A] text-white"
                  required
                />
              </motion.div>

              <div className="flex items-center mt-6 mb-4">
                <hr className="flex-grow border-gray-800" />
                <span className="mx-3 text-gray-400">ATAU</span>
                <hr className="flex-grow border-gray-800" />
              </div>

              <div className="flex flex-col items-center justify-center">
                <motion.button
                  type="button"
                  className="w-full h-12 bg-[#1A1A1A] text-white flex items-center justify-center p-3 rounded-full shadow hover:bg-lime-500 hover:text-black cursor-pointer border border-gray-800 mb-4"
                  initial={{ x: -200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1.2 }}
                >
                  <img
                    src="/images/google-logo.png"
                    alt="Google"
                    className="w-5 h-5 mr-2"
                  />
                  <span className="text-base">Daftar dengan Google</span>
                </motion.button>

                <motion.button
                  type="submit"
                  className="w-full h-14 bg-lime-500 text-black text-lg p-3 mt-4 rounded-full shadow-lg hover:bg-lime-600 cursor-pointer"
                  initial={{ x: -200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1.3 }}
                >
                  Daftar
                </motion.button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <h3 className="text-md font-bold text-white mb-4">Sudah punya akun?</h3>
              <Link to="/login">
                <button className="w-full max-w-xs h-12 border-2 border-lime-500 rounded-full font-semibold text-white hover:bg-lime-500 hover:text-black transition">
                  Masuk Sekarang
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

export default Register;