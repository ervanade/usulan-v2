import React, { useEffect, useRef, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { selectThemeColors } from "../../data/utils";
import Select from "react-select";
import SignatureCanvas from "react-signature-canvas";
import {
  dataBarang,
  dataDistribusiBekasi,
  dataKecamatan,
  dataPuskesmas,
  konfirmasiOptions,
} from "../../data/data";

const ModalProfile = ({
  isVisible,
  onClose,
  onSaveSignature,
  onUploadFile,
  signature,
  file,
  activeTab,
  handleTabChange,
}) => {
  //   const [showModal, setShowModal] = useState(false);
  const signatureRef = useRef(null);

  const handleSaveSignature = () => {
    if (signatureRef.current.isEmpty()) {
      alert("Anda belum TTE");
      return;
    }
    const signatureDataURL = signatureRef.current
      .getTrimmedCanvas()
      .toDataURL("image/png");
    onSaveSignature(signatureDataURL);
    onClose();
  };

  const handleResetSignature = () => {
    signatureRef.current.clear();
    onSaveSignature(null);
    // onClose();
  };

  return (
    <>
      {/* <button
        className="bg-primary text-black active:bg-primary 
      font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Fill Details
      </button> */}
      {isVisible ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-999 outline-none focus:outline-none">
            <div className="overlay fixed top-0 left-0 w-screen h-screen -z-99 bg-black/15"></div>
            <div className="relative my-6 mx-auto w-[85%] max-h-[90%] overflow-auto sm:w-3/4 xl:w-1/2 z-1">
              <div className="bg-white p-4 rounded shadow-md w-full h-full">
                <div className="flex justify-between items-center border-b border-gray-300 mb-4 pb-2">
                  <h2 className="text-lg font-bold text-teal-500">Input TTE</h2>
                  <button
                    className="text-gray-600 hover:text-gray-900"
                    onClick={onClose}
                  >
                    <MdClose className="text-gray-500 opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full" />
                  </button>
                </div>
                <div className="tabs mb-4 flex space-x-4">
                  <button
                    className={`px-4 py-2 font-bold border-b-2 ${
                      activeTab == "tab1"
                        ? "border-teal-500"
                        : "border-transparent"
                    }`}
                    onClick={(e) => handleTabChange(e, "tab1")}
                  >
                    Upload File
                  </button>
                  <button
                    className={`px-4 py-2 font-bold border-b-2 ${
                      activeTab == "tab2"
                        ? "border-teal-500"
                        : "border-transparent"
                    }`}
                    onClick={(e) => handleTabChange(e, "tab2")}
                  >
                    Gambar TTE
                  </button>
                </div>
                <div className="tab-content">
                  {activeTab == "tab1" && (
                    <div
                      id="tab1"
                      className="tab-pane h-64 w-full flex flex-col items-center justify-center"
                    >
                      <div
                        id="FileUpload"
                        className="relative my-2 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-4.5"
                      >
                        <input
                          type="file"
                          onChange={onUploadFile}
                          accept="image/*"
                          className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                        />
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <p>
                            <span className="text-primary">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="mt-1.5">
                            Disarankan Background Berwarna Putih
                          </p>
                          <p>(FILE PNG, 800 X 800px)</p>
                        </div>
                      </div>
                      {/* <input
                        type="file"
                        className="appearance-none block mt-4 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                        onChange={onUploadFile}
                      /> */}
                      {file && (
                        <div className="my-2">
                          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Preview File
                          </label>
                          <img
                            src={URL.createObjectURL(file)}
                            alt="File"
                            className="w-24 mx-auto"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {activeTab == "tab2" && (
                    <div
                      id="tab2"
                      className="tab-pane h-64 w-full flex flex-col items-center justify-center"
                    >
                      <SignatureCanvas
                        ref={signatureRef}
                        canvasProps={{
                          width: 400,
                          height: 200,
                          className: "border border-gray-300",
                        }}
                      />
                      <div className="flex space-x-2 mt-4">
                        <button
                          type="button"
                          className="bg-primary hover:bg-primary text-white font-bold py-2 px-4 rounded"
                          onClick={handleSaveSignature}
                        >
                          Save TTE
                        </button>
                        <button
                          type="button"
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                          onClick={handleResetSignature}
                        >
                          Reset TTE
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default ModalProfile;
