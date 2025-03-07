import React, { useState } from "react";
import DokumenBMN from "../../assets/DokumenBMN.pdf";

const Modal = ({ showModal, setShowModal }) => {
  //   const [showModal, setShowModal] = useState(false);
  return (
    <>
      {/* <button
        className="bg-blue-200 text-black active:bg-blue-500 
      font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Fill Details
      </button> */}
      {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-999 outline-none focus:outline-none">
            <div className="overlay fixed top-0 left-0 w-screen h-screen -z-99 bg-black/15"></div>
            <div className="relative my-6 mx-auto w-full sm:w-3/4 xl:w-1/2 z-1">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-xl font=semibold text-primary">
                    Dokumen Laporan BMN
                  </h3>
                  <button
                    className="bg-transparent border-0 text-black float-right"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="text-red-500 opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                      x
                    </span>
                  </button>
                </div>
                <div className=" p-6 flex-auto">
                  <object
                    width="100%"
                    // height="100Vh"
                    className="h-[calc(100vh-200px)] 2xl:h-[600px]"
                    data={DokumenBMN}
                    type="application/pdf"
                  >
                    {" "}
                  </object>
                </div>
                <div className="flex items-center justify-end p-6 border-t gap-2 border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 border-red-500 border background-transparent rounded-md font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="text-white bg-primary font-bold uppercase text-sm px-6 py-3 rounded-md shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => window.open(DokumenBMN, "Download")}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Modal;
