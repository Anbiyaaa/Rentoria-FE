import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('\hal login (1).png')" }}
    >
      <div className="w-350 h-170 flex">
        <div className="w-2/3 bg-[#D2AB7C] flex flex-col justify-center items-center p-8 rounded-l-4xl relative">
          <div className="absolute top-8 left-5 flex items-center text-2xl font-bold text-white">
            <img src="/Logo R 3.png" height="40" width="40" alt="Logo Rentoria" />
            <span className="mt-4">entoria</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-8">Masuk Ke Rentoria</h2>
          <form onSubmit={handleSubmit} className="w-3/4">
            <div className="mb-4 flex items-center bg-white p-3 rounded-lg shadow">
              <span className="mr-3">📧</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukan Email"
                className="w-full outline-none"
                required
              />
            </div>
            <div className="mb-4 flex items-center bg-white p-3 rounded-lg shadow">
              <span className="mr-3">🔒</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukan Password"
                className="w-full outline-none"
                required
              />
            </div>
            <div class="flex items-center mt-10 mb-6">
              <div class="flex-grow border-t border-black"></div>
              <span class="mx-4 text-black">ATAU</span>
              <div class="flex-grow border-t border-black"></div>
            </div>
            <div className="flex flex-col items-center justify-center">
              {/* Tombol Google dengan ukuran kustom */}
              <button className="w-120 h-13 bg-white flex items-center justify-center p-3 rounded-lg shadow hover:bg-[#5C3B2E] hover:text-white cursor-pointer">
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
                className="w-100 h-16 bg-[#5C3B2E] text-white text-xl p-4 mt-6 rounded-full shadow-lg hover:bg-white hover:text-[#5C3B2E] cursor-pointer"
              >
                Masuk
              </button>
            </div>
          </form>
        </div>

        {/* Bagian Kanan */}
        <div className="w-1/3 bg-[#5C3B2E] flex flex-col justify-center items-center rounded-r-4xl text-white p-12">
          <h2 className="text-[44px] font-bold mb-4 text-center">Selamat Datang Di Rentoria</h2>
          <p className="text-center font-semibold mb-8">Masukkan detail pribadi Anda dan mulailah perjalanan bersama kami</p>
          <Link to="/register">
            <button className="border border-white text-xl px-32 py-3 rounded-full hover:bg-white hover:text-[#5C3B2E] transition cursor-pointer">
              Daftar
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
