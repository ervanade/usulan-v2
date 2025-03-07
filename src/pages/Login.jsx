import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useColorMode from "../hooks/useColorMode";
import { dataUser } from "../data/data";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/authSlice";
import axios from "axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({
    password: "",
    email: "",
    captcha: "",
  });
  const [captchaToken, setCaptchaToken] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const postApiLogin = async () => {
    await axios({
      method: "post",
      url: `${import.meta.env.VITE_APP_API_URL}/api/login`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        email: formData?.email,
        password: formData.password,
      }),
    })
      .then(function (response) {
        const data = response.data.data;
        dispatch(loginUser(data));
        localStorage.setItem("user", JSON.stringify(data));
        setLoading(false);
        if (
          (data.role == "2" || data.role == "3" || data.role == "4") &&
          (!data.ttd || !data.name || !data.nip || !data.profile)
        ) {
          setLoading(false);
          Swal.fire(
            "Warning",
            "Anda Belum Input Nama / NIP / TTE / Logo",
            "warning"
          );
          navigate("/profile");
          return;
        } else if (data.role == "1") {
          navigate("/");
          return;
        } else {
          // handle other roles or default behavior
          navigate("/");
          return;
        }
      })
      .catch((error) => {
        setLoading(false);
        return setError("Invalid username / email or password");
      });
  };
  const handleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!executeRecaptcha) {
      setError("ReCAPTCHA has not been loaded");
      return;
    }
    setLoading(true);
    const token = await executeRecaptcha("login");
    setCaptchaToken(token);
    postApiLogin();

    // const user = dataUser.find((a) => a.email === formData.email);
    // if (!user) {
    //   setLoading(false);
    //   return setError("Invalid email or password");
    // }
    // if (user.password !== formData.password) {
    //   setLoading(false);s
    //   return setError("Invalid email or password");
    // }
    // dispatch(loginUser(user));
    // localStorage.setItem("user", JSON.stringify(user));
    // setLoading(false);
    // navigate("/");
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  const handleCheckboxChange = (event) => {
    setFormData((prev) => ({ ...prev, tanggal: event.target.value }));
  };
  return (
    <div className="w-full !dark:bg-boxdark-2 flex justify-center items-center min-h-[calc(100vh-0px)] bg-transparent object-cover bg-center py-6 !bg-[#8EEBE7]">
      <div className="w-full max-w-lg bg-white shadow-md rounded-md  pt-8 pb-12 mb-4 mx-6">
        <div className="px-5 sm:px-8">
          <div className="logo w-full flex items-center justify-center mb-6">
            <img src="/logo-kemenkes.png" alt="Logo" />
          </div>
          <div className="title mb-6">
            <h1 className="text-[#00B1A9] text-xl sm:text-2xl mb-2 font-normal text-center">
              Masuk ke Layanan SI-MBAH-BMN
            </h1>
            {/* <p className="text-[#404040] text-sm mb-6 font-semibold text-center">
              Hanya di Youtube Oriflame Indonesia
            </p> */}
          </div>
          <form
            className="mt-5"
            onSubmit={handleLogin}
            onKeyDown={handleKeyDown}
          >
            {error && (
              <div className="mb-3 bg-red-100 p-2 rounded-md">
                <p className="text-center text-red-500">{error}</p>
              </div>
            )}

            <div className="mb-3">
              <label
                className="block text-[#728294] text-sm font-normal mb-2"
                htmlFor="email"
              >
                Username / Email
              </label>
              <input
                className={`bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                    "border-red-500" 
                 rounded w-full py-3 px-3 text-[#728294] mb-3 leading-tight focus:outline-none focus:shadow-outline`}
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                type="text"
                required
                placeholder="Username / Email Anda"
              />
            </div>
            <div className="mb-3">
              <label
                className="block text-[#728294] text-sm font-normal mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className={`bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
        "border-red-500" 
        rounded w-full py-3 px-3 text-[#728294] mb-3 leading-tight focus:outline-none focus:shadow-outline`}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="*******"
                />
                <button
                  className="absolute right-4 top-3.5"
                  onClick={handleShowPassword}
                >
                  {showPassword ? (
                    <FaEye size={16} className="text-bodydark2" />
                  ) : (
                    <FaEyeSlash size={16} className="text-bodydark2" />
                  )}
                </button>
              </div>
              <button
                className="absolute right-3 top-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <i className="fas fa-eye-slash"></i>
                ) : (
                  <i className="fas fa-eye"></i>
                )}
              </button>
            </div>
            {/* <div className="mb-3 flex items-center gap-3">
              <div className="col flex-[3_3_0%]">
                <label
                  className="block text-[#728294] text-sm font-normal mb-2"
                  htmlFor="nomor"
                >
                  Captcha
                </label>
                <input
                  className={`bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                    "border-red-500" 
                 rounded w-full py-3 px-3 text-[#728294] mb-3 leading-tight focus:outline-none focus:shadow-outline`}
                  id="captcha"
                  type="captcha"
                  value={formData.captcha}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      captcha: e.target.value,
                    }))
                  }
                  required
                  placeholder="Masukan Captcha"
                />
              </div>
              <div className="flex-[2_2_0%]">
                <img src="/captcha.png" alt="" />
              </div>
            </div> */}
            <div className="flex items-center justify-center mt-6">
              <button
                className="w-full bg-[#0ACBC2]  text-white font-bold py-4 px-6 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={loading}
              >
                {loading ? "Loading..." : "Masuk"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
