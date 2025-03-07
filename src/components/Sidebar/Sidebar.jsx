import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import SidebarLinkGroup from "./SidebarLinkGroup";
import { HiDocument, HiOutlineDocument, HiOutlineHome } from "react-icons/hi";
import { AiOutlineDatabase } from "react-icons/ai";
import { MdOutlineDomainVerification, MdReport } from "react-icons/md";
import { FaTasks, FaUsers } from "react-icons/fa";
import { GrDocumentText } from "react-icons/gr";
import { TbReport } from "react-icons/tb";
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
      className={`absolute left-0 top-0 z-9999 flex h-screen w-67 flex-col overflow-y-hidden bg-[#027d77] duration-300 ease-linear dark:bg-boxdark lg:static ${
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
              <li>
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
              </li>

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

              {/* <li>
                <NavLink
                  to="/laporan"
                  className={`group relative flex items-center gap-2.5 rounded-md py-3 px-4 font-medium text-white duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("laporan") &&
                    "bg-graydark dark:bg-meta-4 text-primary"
                  }`}
                >
                  <TbReport size={22} />
                  Laporan
                </NavLink>
              </li> */}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
