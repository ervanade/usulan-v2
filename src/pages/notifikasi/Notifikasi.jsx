import React, { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Select from "react-select";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import {
  dataDistribusiBekasi,
  dataKecamatan,
  dataKota,
  dataProvinsi,
} from "../../data/data";
import { encryptId, selectThemeColors } from "../../data/utils";
import { FaCheck, FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import { BiExport, BiSolidFileExport } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import { CgRead, CgSpinner } from "react-icons/cg";
import moment from "moment";
import { fetchNotifs, markAsRead } from "../../store/notifSlice";
import parse from "html-react-parser";

import { encode, decode } from "html-encoder-decoder"; // Gunakan import alih-alih require
const Notifikasi = () => {
  const { user } = useSelector((state) => state.auth);
  const { notifs, status, error } = useSelector((state) => state.notifications);
  const unreadNotifs = notifs.filter((notif) => notif.is_read == "0");

  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchNotifs());
  }, [dispatch]);

  useEffect(() => {
    setFilteredData(
      search
        ? notifs.filter((notif) =>
            notif.message?.toLowerCase().includes(search.toLowerCase())
          )
        : notifs
    );
  }, [notifs, search]);

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const columns = useMemo(
    () => [
      {
        name: "No",
        selector: (row, index) => index + 1,
        sortable: true,
        width: "80px",
      },
      {
        name: "Message",
        selector: (row) => row.message,
        sortable: true,
      },
      {
        name: "Tanggal",
        selector: (row) => row.created_at,
        sortable: true,
        width: "180px",
      },
      {
        name: "Status",
        selector: (row) => row.is_read,
        cell: (row) => (
          <div
            className={`p-2 rounded-md text-white ${
              row.is_read == "0" ? "bg-yellow-500" : "bg-green-500"
            }`}
          >
            {row.is_read == "0" ? "Belum Dibaca" : "Sudah Dibaca"}
          </div>
        ),
        sortable: true,
      },
      {
        name: "Aksi",
        selector: (row) => row.is_read,

        cell: (row) => (
          <div>
            {row.is_read == "0" ? (
              <button
                title="Tandai Telah Dibaca"
                className="text-green-500 hover:text-cyan-500"
                onClick={() => handleMarkAsRead(row.id)}
              >
                <FaCheck size={16} />
              </button>
            ) : (
              <div
                className={`p-2 rounded-md text-white ${
                  row.is_read == "0" ? "bg-yellow-500" : "bg-green-500"
                }`}
              >
                {row.is_read == "0" ? "Belum Dibaca" : "Sudah Dibaca"}
              </div>
            )}
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <Breadcrumb pageName="Notifikasi" title="Notifikasi" />
      <div className="rounded-md flex flex-col gap-4 overflow-hidden overflow-x-auto border border-stroke bg-white py-4 md:py-8 px-4 md:px-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-between mb-4 items-center">
          <div className="relative">
            <button className="absolute left-2 top-1/2 -translate-y-1/2">
              <svg
                className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                  fill=""
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                  fill=""
                />
              </svg>
            </button>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari Data..."
              className="w-full bg-white pl-9 pr-4 text-black outline outline-1 outline-zinc-200 focus:outline-primary dark:text-white xl:w-125 py-2 rounded-md"
            />
          </div>
          <div className="div flex gap-2 flex-row">
            <button
              title="Read All"
              className="flex items-center gap-2 cursor-pointer text-base text-white px-4 py-2 bg-green-500 rounded-md tracking-tight"
            >
              <FaCheck />
              <span className="hidden sm:block">Baca Semua</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {status === "loading" ? (
            <div className="flex justify-center items-center">
              <CgSpinner className="animate-spin w-8 h-8 text-teal-400" />
              <span className="ml-2">Loading...</span>
            </div>
          ) : status === "failed" ? (
            <div className="text-center">Data Tidak Tersedia.</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center">Data Tidak Tersedia.</div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredData}
              pagination
              persistTableHead
              highlightOnHover
              pointerOnHover
              customStyles={{
                headCells: {
                  style: {
                    padding: 12,
                    backgroundColor: "#EBFBFA",
                    color: "#212121",
                    fontWeight: 700,
                    fontSize: 14,
                  },
                },
                rows: {
                  style: {
                    fontSize: 14,
                    paddingTop: 6,
                    paddingBottom: 6,
                    backgroundColor: "#FFFFFF",
                    "&:nth-of-type(odd)": {
                      backgroundColor: "#F9FAFB",
                    },
                    highlightOnHoverStyle: {
                      backgroundColor: "#D1E8FF",
                      color: "#212121",
                    },
                  },
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifikasi;
