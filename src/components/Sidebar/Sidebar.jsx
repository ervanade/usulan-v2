import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import SidebarLinkGroup from "./SidebarLinkGroup";
import { HiDocument, HiOutlineDocument, HiOutlineHome } from "react-icons/hi";
import { AiOutlineDatabase } from "react-icons/ai";
import { MdOutlineDomainVerification, MdReport } from "react-icons/md";
import { FaTasks, FaUsers } from "react-icons/fa";
import { GrDocumentText } from "react-icons/gr";
import { TbChartArea, TbChartBar, TbReport } from "react-icons/tb";
import { useSelector } from "react-redux";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;
  const user = useSelector((a) => a.auth.user);

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  // useEffect(() => {
  //   const clickHandler = ({ target }) => {
  //     if (!sidebar.current || !trigger.current) return;
  //     if (
  //       !sidebarOpen ||
  //       sidebar.current.contains(target) ||
  //       trigger.current.contains(target)
  //     )
  //       return;
  //     setSidebarOpen(false);
  //   };
  //   document.addEventListener("click", clickHandler);
  //   return () => document.removeEventListener("click", clickHandler);
  // });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);
  const isActive = (pathnames) => {
    return pathnames.some((pathname) => location.pathname.startsWith(pathname));
  };

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-999 flex h-screen w-67 flex-col overflow-y-hidden bg-[#027d77] duration-300 ease-linear dark:bg-boxdark lg:static ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-4 py-2 lg:py-4 round">
        <NavLink to="/" className="hidden">
          <img src={`/logo-kemenkes.png`} alt="Logo" />
        </NavLink>
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="grid h-10 w-10 place-content-center rounded-full opacity-100 text-white hover:bg-graydark ml-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
            ></path>
          </svg>
        </button>
        {/* <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button> */}
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-1 py-4 px-4 lg:mt-1 lg:px-4">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-white">MENU</h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              <li>
                <NavLink
                  to="/usulan-alkes"
                  className={`group relative flex items-center gap-2.5 rounded-md py-3 px-4 font-medium text-white duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    isActive(["/usulan-alkes"]) &&
                    "bg-graydark dark:bg-meta-4 text-primary"
                  }`}
                >
                  <GrDocumentText size={20} />
                  Usulan Alkes
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/pdf-usulan-alkes"
                  className={`group relative flex items-center gap-2.5 rounded-md py-3 px-4 font-medium text-white duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("pdf-usulan-alkes") &&
                    "bg-graydark dark:bg-meta-4 text-primary"
                  }`}
                >
                  <TbReport size={20} />
                  PDF Usulan Alkes
                </NavLink>
              </li>
              {/* <li>
                <NavLink
                  to="/"
                  className={`group relative flex items-center gap-2.5 rounded-md px-4 py-3 font-medium text-white duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    (pathname === "/" || pathname.includes("dashboard")) &&
                    "bg-graydark dark:bg-meta-4 text-primary"
                  }`}
                >
                  <HiOutlineHome size={22} />
                  Dashboard
                </NavLink>
              </li> */}

              {/* <!-- Menu Item Calendar --> */}
              {/* {user.role == "2" || user.role == "3" ? (
                <>
                  <li>
                    <NavLink
                      to="/data-distribusi"
                      className={`group relative flex items-center gap-2.5 rounded-md py-3 px-4 font-medium text-white duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        pathname.includes("data-distribusi") &&
                        "bg-graydark dark:bg-meta-4 text-primary"
                      }`}
                    >
                      <AiOutlineDatabase size={20} />
                      Data Distribusi
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dokumen"
                      className={`group relative flex items-center gap-2.5 rounded-md py-3 px-4 font-medium text-white duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        isActive([
                          "/dokumen",
                          "/dokumen/add",
                          "/dokumen/edit",
                        ]) && "bg-graydark dark:bg-meta-4 text-primary"
                      }`}
                    >
                      <MdOutlineDomainVerification size={22} />
                      Dokumen & TTE
                    </NavLink>
                  </li>
                </>
              ) : user.role == "1" ? (
                <>
                  <li>
                    <NavLink
                      to="/dokumen"
                      className={`group relative flex items-center gap-2.5 rounded-md py-3 px-4 font-medium text-white duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        isActive([
                          "/dokumen",
                          "/dokumen/add",
                          "/dokumen/edit",
                        ]) && "bg-graydark dark:bg-meta-4 text-primary"
                      }`}
                    >
                      <MdOutlineDomainVerification size={22} />
                      Dokumen & TTE
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/data-distribusi"
                      className={`group relative flex items-center gap-2.5 rounded-md py-3 px-4 font-medium text-white duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        pathname.includes("data-distribusi") &&
                        "bg-graydark dark:bg-meta-4 text-primary"
                      }`}
                    >
                      <AiOutlineDatabase size={20} />
                      Data Distribusi
                    </NavLink>
                  </li>
                </>
              ) : user.role == "4" ? (
                <>
                  <li>
                    <NavLink
                      to="/dokumen"
                      className={`group relative flex items-center gap-2.5 rounded-md py-3 px-4 font-medium text-white duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        isActive([
                          "/dokumen",
                          "/dokumen/add",
                          "/dokumen/edit",
                        ]) && "bg-graydark dark:bg-meta-4 text-primary"
                      }`}
                    >
                      <MdOutlineDomainVerification size={22} />
                      Dokumen & TTE
                    </NavLink>
                  </li>
                </>
              ) : (
                ""
              )} */}
              {/* {user.role == "2" || user.role == "1" || user.role == "3" ? (
                <li>
                  <NavLink
                    to="/dokumen"
                    className={`group relative flex items-center gap-2.5 rounded-md py-3 px-4 font-medium text-white duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      pathname === ("/dokumen") &&
                      "bg-graydark dark:bg-meta-4 text-primary"
                    }`}
                  >
                    <MdOutlineDomainVerification size={22} />
                    Dokumen & TTE
                  </NavLink>
                </li>
              ) : (
                ""
              )}
              <li>
                <NavLink
                  to="/data-distribusi"
                  className={`group relative flex items-center gap-2.5 rounded-md py-3 px-4 font-medium text-white duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("data-distribusi") &&
                    "bg-graydark dark:bg-meta-4 text-primary"
                  }`}
                >
                  <AiOutlineDatabase size={20} />
                  Data Distribusi
                </NavLink>
              </li> */}
              {/* <!-- Menu Item Calendar --> */}

              {/* <!-- Menu Item Profile --> */}

              <li>
                <NavLink
                  to="/laporan"
                  className={`group relative flex items-center gap-2.5 rounded-md py-3 px-4 font-medium text-white duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("laporan") &&
                    "bg-graydark dark:bg-meta-4 text-primary"
                  }`}
                >
                  <TbChartBar size={22} />
                  Laporan
                </NavLink>
              </li>
            </ul>
          </div>
          {/* <!-- Others Group --> */}
          {user.role == "1" ? (
            <div>
              <h3 className="mb-4 ml-4 text-sm font-semibold text-white">
                ADMIN
              </h3>

              <ul className="mb-6 flex flex-col gap-1.5">
                {/* <!-- Menu Item Ui Elements --> */}
                <SidebarLinkGroup
                  activeCondition={
                    pathname === "/master" || pathname.includes("master")
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-md px-4 py-3 font-medium text-white duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                            (pathname === "/master" ||
                              pathname.includes("master")) &&
                            "bg-graydark dark:bg-meta-4 text-primary"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="19"
                            viewBox="0 0 18 19"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clipPath="url(#clip0_130_9807)">
                              <path
                                d="M15.7501 0.55835H2.2501C1.29385 0.55835 0.506348 1.34585 0.506348 2.3021V7.53335C0.506348 8.4896 1.29385 9.2771 2.2501 9.2771H15.7501C16.7063 9.2771 17.4938 8.4896 17.4938 7.53335V2.3021C17.4938 1.34585 16.7063 0.55835 15.7501 0.55835ZM16.2563 7.53335C16.2563 7.8146 16.0313 8.0396 15.7501 8.0396H2.2501C1.96885 8.0396 1.74385 7.8146 1.74385 7.53335V2.3021C1.74385 2.02085 1.96885 1.79585 2.2501 1.79585H15.7501C16.0313 1.79585 16.2563 2.02085 16.2563 2.3021V7.53335Z"
                                fill=""
                              />
                              <path
                                d="M6.13135 10.9646H2.2501C1.29385 10.9646 0.506348 11.7521 0.506348 12.7083V15.8021C0.506348 16.7583 1.29385 17.5458 2.2501 17.5458H6.13135C7.0876 17.5458 7.8751 16.7583 7.8751 15.8021V12.7083C7.90322 11.7521 7.11572 10.9646 6.13135 10.9646ZM6.6376 15.8021C6.6376 16.0833 6.4126 16.3083 6.13135 16.3083H2.2501C1.96885 16.3083 1.74385 16.0833 1.74385 15.8021V12.7083C1.74385 12.4271 1.96885 12.2021 2.2501 12.2021H6.13135C6.4126 12.2021 6.6376 12.4271 6.6376 12.7083V15.8021Z"
                                fill=""
                              />
                              <path
                                d="M15.75 10.9646H11.8688C10.9125 10.9646 10.125 11.7521 10.125 12.7083V15.8021C10.125 16.7583 10.9125 17.5458 11.8688 17.5458H15.75C16.7063 17.5458 17.4938 16.7583 17.4938 15.8021V12.7083C17.4938 11.7521 16.7063 10.9646 15.75 10.9646ZM16.2562 15.8021C16.2562 16.0833 16.0312 16.3083 15.75 16.3083H11.8688C11.5875 16.3083 11.3625 16.0833 11.3625 15.8021V12.7083C11.3625 12.4271 11.5875 12.2021 11.8688 12.2021H15.75C16.0312 12.2021 16.2562 12.4271 16.2562 12.7083V15.8021Z"
                                fill=""
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_130_9807">
                                <rect
                                  width="18"
                                  height="18"
                                  fill="white"
                                  transform="translate(0 0.052124)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                          Master Data
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && "rotate-180"
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden ${
                            !open && "hidden"
                          }`}
                        >
                          <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                            <li>
                              <NavLink
                                to="/master-data-periode"
                                className={({ isActive }) =>
                                  "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-white duration-300 ease-in-out hover:text-bodydark " +
                                  (isActive && "!text-bodydark")
                                }
                              >
                                Data Periode
                              </NavLink>
                            </li>
                            {/* <li>
                              <NavLink
                                to="/master-data-puskesmas"
                                className={({ isActive }) =>
                                  "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-white duration-300 ease-in-out hover:text-bodydark " +
                                  (isActive && "!text-bodydark")
                                }
                              >
                                Data Puskesmas
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/master-data-barang"
                                className={({ isActive }) =>
                                  "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-white duration-300 ease-in-out hover:text-bodydark " +
                                  (isActive && "!text-bodydark")
                                }
                              >
                                Data Alkes
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/master-data-provinsi"
                                className={({ isActive }) =>
                                  "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-white duration-300 ease-in-out hover:text-bodydark " +
                                  (isActive && "!text-bodydark")
                                }
                              >
                                Data Provinsi
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/master-data-kota"
                                className={({ isActive }) =>
                                  "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-white duration-300 ease-in-out hover:text-bodydark " +
                                  (isActive && "!text-bodydark")
                                }
                              >
                                Data Kab/Kota
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/master-data-kecamatan"
                                className={({ isActive }) =>
                                  "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-white duration-300 ease-in-out hover:text-bodydark " +
                                  (isActive && "!text-bodydark")
                                }
                              >
                                Data Kecamatan
                              </NavLink>
                            </li>

                            <li>
                              <NavLink
                                to="/master-data-penyedia"
                                className={({ isActive }) =>
                                  "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-white duration-300 ease-in-out hover:text-bodydark " +
                                  (isActive && "!text-bodydark")
                                }
                              >
                                Data Penyedia
                              </NavLink>
                            </li> */}

                            {/* <li>
                              <NavLink
                                to="/tes-template"
                                className={({ isActive }) =>
                                  "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-white duration-300 ease-in-out hover:text-bodydark " +
                                  (isActive && "!text-bodydark")
                                }
                              >
                                Template Dokumen
                              </NavLink>
                            </li> */}
                          </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
                {/* <!-- Menu Item Ui Elements --> */}
                {/* <li>
                  <NavLink
                    to="/user-management"
                    className={`group relative flex items-center gap-2.5 rounded-md py-3 px-4 font-medium text-white duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      pathname.includes("user-management") &&
                      "bg-graydark dark:bg-meta-4 text-primary"
                    }`}
                  >
                    <FaUsers size={20} />
                    User Management
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/logactivity"
                    className={`group relative flex items-center gap-2.5 rounded-md py-3 px-4 font-medium text-white duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      pathname.includes("logactivity") &&
                      "bg-graydark dark:bg-meta-4 text-primary"
                    }`}
                  >
                    <FaTasks size={20} />
                    Aktivitas Log
                  </NavLink>
                </li> */}
              </ul>
            </div>
          ) : (
            ""
          )}
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
