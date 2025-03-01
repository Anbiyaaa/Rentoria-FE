import { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Nama:", name, "Email:", email, "Password:", password);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('\hal login (1).png')" }}
    >
      <div className="w-350 h-170 flex">

        {/* Bagian kiri */}
        <div className="w-1/3 bg-[#6B4F3D] flex flex-col items-center justify-center text-white p-10 rounded-l-3xl relative">
          <div className="absolute top-8 left-5 flex items-center text-2xl font-bold text-white">
            <img src="/Logo R 3.png" height="40" width="40" alt="Logo Rentoria" />
            <span className="mt-4">entoria</span>
          </div>
          <h2 className="text-[44px] font-bold text-center">Selamat Datang Kembali</h2>
          <p className="w-50 text-center mt-3 font-semibold">
            Untuk tetap terhubung dengan kami, silakan login dengan informasi pribadi Anda
          </p>
          <Link to="/login">
            <button className="mt-6 px-24 py-4 border-2 border-white rounded-full font-semibold text-white hover:bg-white hover:text-[#6B4F3D] transition">
              Masuk
            </button>
          </Link>
        </div>

        {/* Bagian kanan */}
        <div className="w-2/3 bg-[#D2AB7C] flex flex-col justify-center items-center p-10  rounded-r-3xl">
          <h2 className="text-5xl font-bold mb-16 text-white">Daftar Ke Rentoria</h2>
          <form onSubmit={handleSubmit} className="w-120">
            <div className="mb-4 flex items-center bg-white text-black px-3 rounded-lg shadow">
              <FaUser className="left-3 top-3 text-black" />
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-lg outline-none"
                required
              />
            </div>
            <div className="mb-4 flex items-center bg-white px-3 rounded-lg shadow">
              <FaEnvelope className="left-3 top-3 text-black" />
              <input
                type="email"
                placeholder="Masukan Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg outline-none"
                required
              />
            </div>
            <div className="mb-4 flex items-center bg-white px-3 rounded-lg shadow">
              <FaLock className="left-3 top-3 text-black" />
              <input
                type="password"
                placeholder="Masukan Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg outline-none"
                required
              />
            </div>
            <div className="flex items-center mt-10 mb-6">
              <hr className="flex-grow border-black" />
              <span className="mx-3 text-black">ATAU</span>
              <hr className="flex-grow border-black" />
            </div>
            <div className="flex flex-col items-center justify-center">
              {/* Tombol Google dengan ukuran kustom */}
              <button className="w-90 h-13 bg-white flex items-center justify-center p-3 rounded-full shadow hover:bg-[#5C3B2E] hover:text-white cursor-pointer">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                  alt="Google"
                  className="w-6 h-6 mr-2"
                />
                <span className="text-lg">Google</span>
              </button>

              {/* Tombol Masuk dengan ukuran kustom */}
              <button
                type="submit"
                className="w-70 h-16 bg-[#5C3B2E] text-white text-xl p-4 mt-6 rounded-full shadow-lg hover:bg-white hover:text-[#5C3B2E] cursor-pointer"
              >
                Daftar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
