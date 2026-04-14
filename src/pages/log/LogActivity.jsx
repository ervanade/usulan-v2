import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DataTable from "react-data-table-component";
import { BiExport } from "react-icons/bi";
import { useSelector } from "react-redux";
import axios from "axios";
import { CgSpinner } from "react-icons/cg";
import moment from "moment";

const LogActivity = () => {
  const user = useSelector((a) => a.auth.user);

  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Pagination state from API
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(100);

  const fetchLogData = async (page = 1, limit = perPage, searchVal = search) => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios({
        method: "get",
        url: `${import.meta.env.VITE_APP_API_URL}/api/log`,
        params: { page, per_page: limit, search: searchVal || undefined },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const paged = response.data.data;
      setData(paged.data);
      setTotalRows(paged.total);
      setCurrentPage(paged.current_page);
    } catch {
      setError(true);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogData(1, perPage, search);
  }, []);

  const handlePageChange = (page) => {
    fetchLogData(page, perPage, search);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    fetchLogData(page, newPerPage, search);
  };

  // Debounce search to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogData(1, perPage, search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleExport = async () => {
    const XLSX = await import("xlsx");
    const exportData = data?.map((item) => ({
      User: item?.name,
      Aksi: item?.action,
      Desc: item?.desc,
      Url: item?.uri,
      Tanggal: item?.created_at,
    }));
    const wb = XLSX.utils.book_new();
    const cols = [
      { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 25 }, { wch: 20 },
    ];
    const ws = XLSX.utils.json_to_sheet(exportData);
    ws["!cols"] = cols;
    XLSX.utils.book_append_sheet(wb, ws, "Aktivitas Log");
    const tanggal = moment().locale("id").format("DD MMMM YYYY HH:mm");
    XLSX.writeFile(wb, `Aktivitas Log ${tanggal}.xlsx`);
  };

  const columns = useMemo(
    () => [
      {
        name: "Nama User",
        selector: (row) => row.name,
        sortable: true,
        width: "180px",
      },
      {
        name: "Aksi",
        selector: (row) => row.action,
        sortable: true,
        width: "100px",
      },
      {
        name: "Desc",
        selector: (row) => row.desc,
        sortable: true,
      },
      {
        name: "URL",
        selector: (row) => row.uri,
        sortable: true,
      },
      {
        name: "Tanggal",
        selector: (row) => row.created_at,
        sortable: true,
      },
    ],
    []
  );

  return (
    <div>
      <Breadcrumb pageName="Aktivitas Log" title="Aktivitas Log" />
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
          <div className="flex gap-2 flex-row">
            <button
              title="Export Data Log"
              className="flex items-center gap-2 cursor-pointer text-base text-white px-4 py-2 bg-primary rounded-md tracking-tight"
              onClick={handleExport}
            >
              <BiExport />
              <span className="hidden sm:block">Export</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {error ? (
            <div className="text-center">Data Tidak Tersedia.</div>
          ) : (
            <DataTable
              columns={columns}
              data={data}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              paginationDefaultPage={currentPage}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handlePerRowsChange}
              paginationRowsPerPageOptions={[10, 25, 50, 100]}
              paginationPerPage={perPage}
              progressPending={loading}
              progressComponent={
                <div className="flex justify-center items-center py-6">
                  <CgSpinner className="animate-spin inline-block w-8 h-8 text-teal-400" />
                  <span className="ml-2">Loading...</span>
                </div>
              }
              persistTableHead
              highlightOnHover
              pointerOnHover
              customStyles={{
                headCells: {
                  style: {
                    padding: 12,
                    backgroundColor: "#0FAD91",
                    color: "#fff",
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

export default LogActivity;
