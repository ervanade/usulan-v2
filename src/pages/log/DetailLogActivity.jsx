import React, { useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  dataBarang,
  dataKecamatan,
  dataPuskesmas,
  roleOptions,
} from "../../data/data";
import { decryptId, selectThemeColors } from "../../data/utils";
import Select from "react-select";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import axios from "axios";
import { CgSpinner } from "react-icons/cg";
import * as XLSX from "xlsx";
import FormInput from "../../components/Form/FormInput";

const DetailLogActivity = () => {
  const [formData, setFormData] = useState({
    user: "",
    aksi: "",
    url: "",
    desc: "",
    model: "",
  });

  const navigate = useNavigate();
  const user = useSelector((a) => a.auth.user);

  const [getLoading, setGetLoading] = useState(false);

  const [listKota, setListKota] = useState([]);
  const [listKecamatan, setListKecamatan] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const fetchLogData = async () => {
    setGetLoading(true);
    try {
      // eslint-disable-next-line
      const responseUser = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/log/${encodeURIComponent(
          decryptId(id)
        )}`,
        headers: {
          "Content-Type": "application/json",
          //eslint-disable-next-line
          Authorization: `Bearer ${user?.token}`,
        },
      }).then(function (response) {
        // handle success
        // console.log(response)
        const data = response.data.data;
        setFormData({
          name: data.name || "",
          aksi: data.action || "",
          desc: data.desc || "",
          url: data.url || "",
          model: data.model || "",
          tanggal: data.created_at || "",
        });
      });
      setGetLoading(false);
    } catch (error) {
      if (error.response.status == 404) {
        navigate("/not-found");
      }
      console.log(error);
    }
  };

  const handleChange = (event) => {
    const { id, value, files } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const updateProvinsi = async () => {
    await axios({
      method: "put",
      url: `${
        import.meta.env.VITE_APP_API_URL
      }/api/provinsi/${encodeURIComponent(decryptId(id))}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      data: JSON.stringify(formData),
    })
      .then(function (response) {
        Swal.fire("Data Berhasil di Update!", "", "success");
        navigate("/master-data-provinsi");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };
  const handleSimpan = async (e) => {
    e.preventDefault();
    setLoading(true);
    updateProvinsi();
  };
  useEffect(() => {
    fetchLogData();
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
    <div>
      <Breadcrumb pageName="Form Edit Data Provinsi" />
      <Card>
        <div className="card-header flex justify-between">
          <h1 className="mb-12 font-medium font-antic text-xl lg:text-[28px] tracking-tight text-left text-bodydark1">
            {user.role == "1" ? "Form Edit Data Provinsi" : ""}
          </h1>
          <div>
            <Link
              to="/logactivity"
              className="flex items-center px-4 py-2 bg-primary text-white rounded-md font-semibold"
            >
              Back
            </Link>
          </div>
        </div>
        <div className="w-full 2xl:w-4/5 ">
          <form className="mt-5" onSubmit={handleSimpan}>
            <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
              <div className="sm:flex-[2_2_0%]">
                <label
                  className="block text-[#728294] text-base font-normal mb-2"
                  htmlFor="name"
                >
                  Nama User :
                </label>
              </div>
              <div className="sm:flex-[5_5_0%]">
                <input
                  className={`sm:flex-[5_5_0%] bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                  "border-red-500" 
               rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                  id="name"
                  value={formData.user}
                  onChange={handleChange}
                  type="text"
                  disabled
                  required
                  placeholder="Nama User"
                />
              </div>
            </div>

            <FormInput
              id="aksi"
              value={formData.aksi}
              onChange={handleChange}
              type="text"
              required
              disabled
              placeholder="Aksi"
              label="Aksi :"
            />
            <FormInput
              id="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              type="text"
              required
              disabled
              placeholder="Tanggal"
              label="Tanggal :"
            />
            <FormInput
              id="url"
              value={formData.url}
              onChange={handleChange}
              type="text"
              required
              disabled
              placeholder="URL"
              label="URL :"
            />
            <FormInput
              id="desc"
              value={formData.desc}
              onChange={handleChange}
              type="text"
              required
              disabled
              placeholder="Deskripsi"
              label="Deskripsi :"
            />
            {/* <div className="flex items-center justify-center mt-6 sm:mt-12 sm:gap-8">
              <div className="div sm:flex-[2_2_0%]"></div>
              <div className="div sm:flex-[5_5_0%] ">
                <div className="w-4/5 flex items-center gap-4">
                  <button
                    className="w-full bg-[#0ACBC2]  text-white font-bold py-4 px-6 rounded-md focus:outline-none focus:shadow-outline dark:bg-transparent"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Simpan"}
                  </button>
                  <button
                    onClick={() => {
                      navigate("/");
                    }}
                    className="w-full bg-[#fff]  text-[#0ACBC2] border border-[#0ACBC2] font-bold py-4 px-6 rounded-md focus:outline-none focus:shadow-outline dark:bg-transparent"
                  >
                    {loading ? "Loading..." : "Batal"}
                  </button>
                </div>
              </div>
            </div> */}
          </form>
        </div>
      </Card>
    </div>
  );
};

export default DetailLogActivity;
