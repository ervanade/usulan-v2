import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import { Outlet } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        // 1024px adalah breakpoint lg di Tailwind CSS
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize(); // Set nilai awal saat komponen mount

    window.addEventListener("resize", handleResize); // Tambahkan event listener

    return () => {
      window.removeEventListener("resize", handleResize); // Hapus event listener saat unmount
    };
  }, [setSidebarOpen]); // Tambahkan setSidebarOpen sebagai dependency

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div
          className={`relative flex flex-1 flex-col md:py-2 md:px-6 2xl:px-8 overflow-y-auto overflow-x-hidden duration-300 ease-linear ${
            sidebarOpen ? "lg:ml-[0px]" : "lg:ml-[-268px]" // Tambahkan margin-left di sini
          }`}
        >
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto px-4 md:px-0  py-4 md:py-6 2xl:py-10">
              <Outlet />
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default Layout;
