import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ModalAddBarang from "../Modal/ModalAddBarang";
import { useState } from "react";
import ModalTTE from "../Modal/ModalTTE";
const Breadcrumb = ({ pageName, back, tte, jsonData, linkBack, title }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const handleSimpan = async (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="hidden text-title-md2 font-semibold text-[#728294] dark:text-white">
        {pageName}
      </h2>
      {title ? (
        <h1 className="font-semibold mb-3 text-xl lg:text-[28px] tracking-tight text-left text-bodydark1">
          {title || ""}
        </h1>
      ) : (
        <div className={back ? "hidden" : ""}></div>
      )}

      {back ? (
        <button
          onClick={() =>
            navigate(
              `${linkBack ? linkBack : `/data-distribusi/edit/${jsonData?.id}`}`
            )
          }
          className="flex items-center px-4 py-2 bg-primary text-white rounded-md font-semibold"
        >
          Back
        </button>
      ) : (
        ""
      )}
      <ModalTTE
        show={showModal}
        onClose={() => setShowModal(false)}
        jsonData={jsonData}
      />
      {tte ? (
        <div>
          <button
            type="button"
            className={` disabled:bg-red-100 disabled:text-red-500 bg-blue-600  text-white font-bold py-2 px-5 rounded-md focus:outline-none focus:shadow-outline dark:bg-transparent`}
            onClick={handleSimpan}
            disabled={jsonData?.jumlahDikirim != jsonData?.jumlahDiterima}
          >
            {jsonData?.jumlahDikirim != jsonData?.jumlahDiterima
              ? "Pastikan Jumlah Barang Dikirim / DIterima Sama Sebelum TTD !"
              : "Tanda Tangani Dokumen"}
          </button>
        </div>
      ) : (
        ""
      )}

      <div>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium text-[#B6BEC7]" to="/">
              Home /
            </Link>
          </li>
          <li className="font-medium text-[#728294]">{pageName}</li>
        </ol>
      </div>
    </div>
  );
};

export default Breadcrumb;
