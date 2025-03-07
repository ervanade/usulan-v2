import React, { useEffect, useState } from "react";
import CardDataStats from "../components/CardDataStats";
import { MdOutlineDomainVerification } from "react-icons/md";
import { AiOutlineDatabase } from "react-icons/ai";
import { PiShieldWarningBold } from "react-icons/pi";
import { RiHospitalLine } from "react-icons/ri";
import Article1 from "../assets/article/article-3.png";
import Article2 from "../assets/article/article-2.jpg";
import Article3 from "../assets/article/article-1.png";
import Admin from "../assets/article/admin.png";
import Daerah from "../assets/article/daerah.png";
import { useSelector } from "react-redux";
import { returnRole } from "../data/utils";
import axios from "axios";
import { CgSpinner } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const user = useSelector((a) => a.auth.user);
  const [formData, setFormData] = useState({});
  const [getLoading, setGetLoading] = useState(false);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    setGetLoading(true);
    try {
      // eslint-disable-next-line
      const responseUser = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/dashboard`,
        headers: {
          "Content-Type": "application/json",
          //eslint-disable-next-line
          Authorization: `Bearer ${user?.token}`,
        },
      }).then(function (response) {
        // handle success
        // console.log(response)
        const data = response.data.data;
        setFormData(data);
        setGetLoading(false);
      });
    } catch (error) {
      if (error.response.status == 404) {
        navigate("/not-found");
      }
      setGetLoading(false);

      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);
  if (getLoading) {
    return (
      <div className="flex justify-center items-center">
        <CgSpinner className="animate-spin inline-block w-8 h-8 text-teal-400" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }
  return (
    <div className="">
      <div className="rounded-md border border-stroke bg-white py-4 md:py-12 px-4 md:px-8 shadow-default dark:border-strokedark dark:bg-boxdark flex items-center gap-6 text-bodydark2">
        <img src="/welcome.png" alt="Welcome" />
        <div className="welcome-text">
          <h1 className="font-semibold mb-3 text-xl lg:text-[28px] tracking-tight">
            SELAMAT DATANG {user.username || "Username"}
          </h1>
          <p className="font-normal text-xl lg:text-[24px] tracking-tight">
            {user.username || "Username"}
          </p>
          <p className="font-normal text-xl lg:text-[24px] tracking-tight">
            Role : {user.role ? returnRole(user.role) : "" || "Role"}
          </p>
        </div>
      </div>
      <div className="mt-4 md:mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="Data Distribusi"
          total={formData?.total || "0"}
          rate="0.43%"
          color="text-[#42DFC3]"
          levelUp
        >
          <div className="flex p-2 items-center justify-center rounded-md bg-[#E7FBF7] dark:bg-meta-4">
            <AiOutlineDatabase size={28} className="fill-primary " />
          </div>
        </CardDataStats>
        <CardDataStats
          title="Data Terverifikasi"
          total={formData?.verifikasi || "0"}
          rate="4.35%"
          color="text-[#79DF42]"
          levelUp
        >
          <div className="flex p-2 items-center justify-center rounded-md bg-[#EEFBE7] dark:bg-meta-4">
            <MdOutlineDomainVerification
              size={28}
              className="fill-[#79DF42] "
            />
          </div>
        </CardDataStats>
        <CardDataStats
          title="Data Belum Terverifikasi"
          total={formData?.belum_verifikasi || "0"}
          rate="2.59%"
          color="text-[#DFB342]"
          levelUp
        >
          <div className="flex p-2 items-center justify-center rounded-md bg-[#FBF5E7] dark:bg-meta-4">
            <PiShieldWarningBold size={28} className="fill-[#DFB342] " />
          </div>
        </CardDataStats>
        <CardDataStats
          title="Data Belum Diproses"
          total={formData?.belum_proses || "0"}
          rate="0.95%"
          color="text-[#F46D6D]"
          levelDown
        >
          <div className="flex p-2 items-center justify-center rounded-md bg-[#FBE7E7] dark:bg-meta-4">
            <PiShieldWarningBold size={28} className="fill-[#F46D6D] " />
          </div>
        </CardDataStats>
      </div>
      <div className="mt-4 md:mt-8 rounded-md border border-stroke bg-white py-6 md:py-12 px-4 md:px-8 shadow-default dark:border-strokedark dark:bg-boxdark text-bodydark2">
        <div className="welcome-text">
          <h1 className="font-semibold mb-3 text-xl lg:text-[28px] tracking-tight text-center">
            TUTORIAL PENGGUNAAN SIMBAH-BMN
          </h1>
        </div>
        <div className="article-wrapper mt-12 flex flex-col lg:flex-row gap-8 w-full">
          {[
            {
              title: "Tutorial SIMBAH-BMN Admin Pusat",
              img: Admin,
              link: "https://drive.google.com/file/d/11NaTKiULMGazHSsjDCS5W_TUoSDzyerl/view?usp=sharing",
            },
            {
              title: "Tutorial SIMBAH-BMN User Daerah",
              img: Daerah,
              link: "https://drive.google.com/file/d/1bjpysZp4-tDog7ENr9r3LKmdiwowFjmJ/view?usp=sharing",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="w-full bg-transpatent border border-[#cacaca] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
            >
              <a
                href={item.link || "https://kesmas.kemkes.go.id/"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="rounded-t-lg max-h-64 w-full object-cover"
                  src={item.img}
                  alt="article"
                />
              </a>
              <div className="p-5">
                {/* <a href="#" className=""> */}
                <p className="mb-4 text-xl lg:text-2xl font-medium tracking-tight text-gray-900 dark:text-white line-clamp-2">
                  {item.title}
                </p>
                {/* </a> */}
                <a
                  href={item.link || "https://kesmas.kemkes.go.id/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-primary rounded-lg hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary"
                >
                  Read more
                  <svg
                    className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 md:mt-8 rounded-md border border-stroke bg-white py-6 md:py-12 px-4 md:px-8 shadow-default dark:border-strokedark dark:bg-boxdark text-bodydark2">
        <div className="welcome-text">
          <h1 className="font-semibold mb-3 text-xl lg:text-[28px] tracking-tight text-center">
            PENGUMUMAN & INFORMASI
          </h1>
        </div>
        <div className="article-wrapper mt-12 flex flex-col lg:flex-row gap-8 w-full">
          {[
            {
              title: "Berita Kesehatan Masyarakat Kemenkes",
              img: Article1,
              link: "https://kesmas.kemkes.go.id/",
            },
            {
              title: "Belajar Bareng di Plataran Sehat",
              img: Article2,
              link: "https://lms.kemkes.go.id/courses?search=",
            },
            {
              title: "Panduan SIMBAH BMN User Daerah",
              img: Article3,
              link: "https://docs.google.com/document/d/1zNGuUaaQ4WP_dHdDIP6tkSEeeJB-Z7IqhmPlehhAQsc/edit?usp=sharing",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="w-full bg-transpatent border border-[#cacaca] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
            >
              <a
                href={item.link || "https://kesmas.kemkes.go.id/"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="rounded-t-lg max-h-64 w-full object-cover"
                  src={item.img}
                  alt="article"
                />
              </a>
              <div className="p-5">
                {/* <a href="#" className=""> */}
                <p className="mb-4 text-xl lg:text-2xl font-medium tracking-tight text-gray-900 dark:text-white line-clamp-2">
                  {item.title}
                </p>
                {/* </a> */}
                <a
                  href={item.link || "https://kesmas.kemkes.go.id/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-primary rounded-lg hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary"
                >
                  Read more
                  <svg
                    className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
