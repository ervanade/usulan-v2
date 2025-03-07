import React, { useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { Link, useNavigate, useParams } from "react-router-dom";
import { decryptId, selectThemeColors } from "../../data/utils";
import Select from "react-select";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import axios from "axios";
import { validateForm } from "../../data/validationUtils";

const TambahKecamatan = () => {
  const [formData, setFormData] = useState({
    name: "",
    id_kabupaten: "",
  });
  const [selectedProvinsi, setSelectedProvinsi] = useState(null);

  const navigate = useNavigate();
  const user = useSelector((a) => a.auth.user);

  const [listProvinsi, setListProvinsi] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const fetchProvinsiData = async () => {
    try {
      const response = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/kabupaten`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setListProvinsi(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const tambahKota = async () => {
    try {
      await axios({
        method: "post",
        url: `${import.meta.env.VITE_APP_API_URL}/api/kabupaten`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        data: JSON.stringify({
          name: formData.name,
          id_kabupaten: formData.id_kabupaten.toString(),
        }),
      });
      Swal.fire("Data Berhasil di Update!", "", "success");
      navigate("/master-data-kota");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleSimpan = async (e) => {
    e.preventDefault();
    if (!validateForm(formData, ["name", "id_kabupaten"])) return;

    setLoading(true);
    tambahKota();
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedProvinsi(selectedOption);
    setFormData((prev) => ({
      ...prev,
      id_kabupaten: selectedOption ? selectedOption.value : "",
    }));
  };

  useEffect(() => {
    fetchProvinsiData();
  }, []);

  return (
    <div>
      <Breadcrumb pageName="Form Tambah Data Kecamatan" />
      <Card>
        <div className="card-header flex justify-between">
          <h1 className="mb-12 font-medium font-antic text-xl lg:text-[28px] tracking-tight text-left text-bodydark1">
            {user.role == "1" ? "Form Tambah Data Kecamatan" : ""}
          </h1>
          <div>
            <Link
              to="/master-data-kota"
              className="flex items-center px-4 py-2 bg-primary text-white rounded-md font-semibold"
            >
              Back
            </Link>
          </div>
        </div>
        <div className="w-full 2xl:w-4/5">
          <form className="mt-5" onSubmit={handleSimpan}>
            <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
              <div className="sm:flex-[2_2_0%]">
                <label
                  className="block text-[#728294] text-base font-normal mb-2"
                  htmlFor="name"
                >
                  Nama Kecamatan :
                </label>
              </div>
              <div className="sm:flex-[5_5_0%]">
                <input
                  className={`sm:flex-[5_5_0%] bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                  "border-red-500"
                  rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  type="text"
                  required
                  placeholder="Nama Kecamatan"
                />
              </div>
            </div>

            <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
              <div className="sm:flex-[2_2_0%]">
                <label
                  className="block text-[#728294] text-base font-normal mb-2"
                  htmlFor="provinsi"
                >
                  Kab / Kota :
                </label>
              </div>
              <div className="sm:flex-[5_5_0%]">
                <Select
                  options={listProvinsi.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  value={selectedProvinsi}
                  onChange={handleSelectChange}
                  placeholder="Pilih Kab/Kota"
                  className="w-full"
                  theme={selectThemeColors}
                />
              </div>
            </div>

            <div className="flex items-center justify-center mt-6 sm:mt-12 sm:gap-8">
              <div className="div sm:flex-[2_2_0%]"></div>
              <div className="div sm:flex-[5_5_0%]">
                <div className="w-4/5 flex items-center gap-4">
                  <button
                    className="w-full bg-[#0ACBC2] text-white font-bold py-4 px-6 rounded-md focus:outline-none focus:shadow-outline dark:bg-transparent"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Simpan"}
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="w-full bg-[#fff] text-[#0ACBC2] border border-[#0ACBC2] font-bold py-4 px-6 rounded-md focus:outline-none focus:shadow-outline dark:bg-transparent"
                  >
                    {loading ? "Loading..." : "Batal"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default TambahKecamatan;
