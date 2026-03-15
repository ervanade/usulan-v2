import React, { useState } from "react";
import Card from "../../components/Card/Card";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { postLimbah } from "../../api/services/usulanService";
import { mutate } from "swr";
import { validateForm } from "../../data/validationUtils";

const TambahLimbah = () => {
  const [formData, setFormData] = useState({
    nama_pengelolaan_limbah: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const saveBarang = async () => {
    await postLimbah(formData)
      .then(function (response) {
        Swal.fire("Data Berhasil di Simpan!", "", "success");
        mutate("limbah");
        navigate("/master-data-limbah");
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire("Error", "Gagal menyimpan data", "error");
        console.log(error);
      });
  };

  const handleSimpan = async (e) => {
    e.preventDefault();
    if (!validateForm(formData, ["nama_pengelolaan_limbah"])) return;
    setLoading(true);
    saveBarang();
  };

  return (
    <div>
      <Breadcrumb pageName="Form Tambah Data Limbah" />
      <Card>
        <div className="card-header flex justify-between">
          <h1 className="mb-12 font-medium font-antic text-xl lg:text-[28px] tracking-tight text-left text-bodydark1">
            Form Tambah Data Limbah
          </h1>
          <div>
            <Link
              to="/master-data-limbah"
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
                  htmlFor="nama_pengelolaan_limbah"
                >
                  Nama Limbah :
                </label>
              </div>
              <div className="sm:flex-[5_5_0%]">
                <input
                  className={`sm:flex-[5_5_0%] bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
                rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
                  id="nama_pengelolaan_limbah"
                  value={formData.nama_pengelolaan_limbah}
                  onChange={handleChange}
                  type="text"
                  required
                  placeholder="Nama Limbah"
                />
              </div>
            </div>

            <div className="flex items-center justify-center mt-6 sm:mt-12 sm:gap-8">
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
                      navigate("/master-data-limbah");
                    }}
                    type="button"
                    className="w-full bg-[#fff]  text-[#0ACBC2] border border-[#0ACBC2] font-bold py-4 px-6 rounded-md focus:outline-none focus:shadow-outline dark:bg-transparent"
                  >
                    Batal
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

export default TambahLimbah;
