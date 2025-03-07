import { useEffect, useLayoutEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import DataDistribusi from "./pages/distribusi/DataDistribusi";
import TambahDistribusi from "./pages/distribusi/TambahDistribusi";
import UserManagement from "./pages/admin/UserManagement";
import LaporanPreview from "./pages/LaporanPreview";
import ProtectedRoute from "./components/Layout/ProtectedRoutes";
import EditDistribusi from "./pages/distribusi/EditDistribusi";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";
import ProtectedRoutesAdmin from "./components/Layout/ProtectedRoutesAdmin";
import Profile from "./pages/Profile";
import TesTemplate from "./pages/TesTemplate";
import TemplateDokumen from "./components/Modal/TemplateDokumen";
import PreviewDokumen from "./pages/distribusi/PreviewDokumen";
import DataBarang from "./pages/master-barang/DataBarang";
import DataPuskesmas from "./pages/master-puskesmas/DataPuskesmas";
import DataKecamatan from "./pages/master-kecamatan/DataKecamatan";
import DataProvinsi from "./pages/master-provinsi/DataProvinsi";
import DetailDistribusi from "./pages/distribusi/DetailDistribusi";
import TambahUser from "./pages/admin/TambahUser";
import EditProvinsi from "./pages/master-provinsi/EditProvinsi";
import TambahProvinsi from "./pages/master-provinsi/TambahProvinsi";
import TambahBarang from "./pages/master-barang/TambahBarang";
import EditBarang from "./pages/master-barang/EditBarang";
import TambahPuskesmas from "./pages/master-puskesmas/TambahPuskesmas";
import EditPuskesmas from "./pages/master-puskesmas/EditPuskesmas";
import DataKota from "./pages/master-kota/DataKota";
import TambahKota from "./pages/master-kota/TambahKota";
import EditKota from "./pages/master-kota/EditKota";
import DetailProvinsi from "./pages/master-kota/DetailProvinsi";
import DetailProvinsiKota from "./pages/master-kecamatan/DetailProvinsiKota";
import TambahKecamatan from "./pages/master-kecamatan/TambahKecamatan";
import EditKecamatan from "./pages/master-kecamatan/EditKecamatan";
import DetailKota from "./pages/master-kecamatan/DetailKota";
import Dokumen from "./pages/dokumen/Dokumen";
import TambahDokumen from "./pages/dokumen/TambahDokumen";
import EditDokumen from "./pages/dokumen/EditDokumen";
import AksiDistribusi from "./pages/distribusi/AksiDistribusi";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import EditUser from "./pages/admin/EditUser";
import DetailLaporanProvinsi from "./pages/laporan/DetailLaporanProvinsi";
import Laporan from "./pages/laporan/Laporan";
import DetailLaporanKabupaten from "./pages/laporan/DetailLaporanKabupaten";
import DetailLaporanPuskesmas from "./pages/laporan/DetailLaporanPuskesmas";
import LaporanBarang from "./pages/laporan/LaporanBarang";
import LaporanDetailBarang from "./pages/laporan/LaporanDetailBarang";
import TesUpload from "./pages/tes-upload/TesUpload";
import LogActivity from "./pages/log/LogActivity";
import DetailLogActivity from "./pages/log/DetailLogActivity";
import LaporanBarangProvinsi from "./pages/laporan/LaporanBarangProvinsi";
import LaporanBarangKabupaten from "./pages/laporan/LaporanBarangKabupaten";
import LaporanBarangPuskesmas from "./pages/laporan/LaporanBarangPuskesmas";
import Notifikasi from "./pages/notifikasi/Notifikasi";
import DokumenDistributor from "./pages/dokumen-distributor/DokumenDistributor";
import DataPenyedia from "./pages/master-penyedia/DataPenyedia";
import TambahPenyedia from "./pages/master-penyedia/TambahPenyedia";
import EditPenyedia from "./pages/master-penyedia/EditPenyedia";

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  const Wrapper = ({ children }) => {
    const location = useLocation();
    useLayoutEffect(() => {
      document.documentElement.scrollTo(0, 0);
    }, [location.pathname]);
    return children;
  };

  return (
    <>
      <Wrapper>
        <Routes>
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="tes-template" element={<TesTemplate />} />
              <Route path="preview-dokumen/:id" element={<TemplateDokumen />} />
              <Route path="data-distribusi" element={<DataDistribusi />} />
              <Route
                path="data-distribusi/detail/:id"
                element={<DetailDistribusi />}
              />
              <Route
                path="/dokumen-distributor"
                element={<DokumenDistributor />}
              />

              <Route path="dokumen" element={<Dokumen />} />
              <Route path="tes-upload" element={<TesUpload />} />
              <Route path="dokumen/add" element={<TambahDokumen />} />
              <Route path="dokumen/edit/:id" element={<EditDokumen />} />

              <Route path="profile" element={<Profile />} />
              <Route
                path="data-distribusi/edit/:id"
                // element={<EditDistribusi />}
                element={<AksiDistribusi />}
              />
              <Route
                path="dokumen/preview-dokumen/:id"
                element={<PreviewDokumen />}
              />
              <Route path="laporanbarang" element={<LaporanBarang />} />
              <Route
                path="laporanbarang/detail/:idBarang/:idProvinsi/:idKabupaten"
                element={<LaporanBarangPuskesmas />}
              />
              <Route
                path="laporanbarang/detail/:idBarang/:idProvinsi"
                element={<LaporanBarangKabupaten />}
              />
              <Route
                path="laporanbarang/detail/:idBarang"
                element={<LaporanBarangProvinsi />}
              />

              <Route path="laporan" element={<Laporan />} />
              <Route
                path="laporan/detail/:idProvinsi/:idKabupaten/:idPuskesmas"
                element={<DetailLaporanPuskesmas />}
              />
              <Route
                path="laporan/detail/:idProvinsi/:idKabupaten"
                element={<DetailLaporanKabupaten />}
              />
              <Route
                path="laporan/detail/:idProvinsi"
                element={<DetailLaporanProvinsi />}
              />
              <Route path="preview-laporan" element={<LaporanPreview />} />
              <Route
                path="/data-verifikasi/form-distribusi"
                element={<TambahDistribusi />}
              />
              <Route path="/not-found" element={<NotFound />} />
              <Route path="notifikasi" element={<Notifikasi />} />
              <Route path="/" element={<ProtectedRoutesAdmin />}>
                <Route path="/logactivity" element={<LogActivity />} />
                <Route
                  path="/logactivity/detail/:id"
                  element={<DetailLogActivity />}
                />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/user-management/add" element={<TambahUser />} />
                <Route
                  path="/user-management/edit/:id"
                  element={<EditUser />}
                />
                <Route
                  path="data-distribusi/add"
                  element={<TambahDistribusi />}
                />

                <Route path="master-data-barang" element={<DataBarang />} />
                <Route
                  path="master-data-barang/add"
                  element={<TambahBarang />}
                />
                <Route
                  path="master-data-barang/edit/:id"
                  element={<EditBarang />}
                />

                <Route
                  path="master-data-puskesmas"
                  element={<DataPuskesmas />}
                />
                <Route
                  path="master-data-puskesmas/add"
                  element={<TambahPuskesmas />}
                />
                <Route
                  path="master-data-puskesmas/edit/:id"
                  element={<EditPuskesmas />}
                />

                <Route path="master-data-penyedia" element={<DataPenyedia />} />
                <Route
                  path="master-data-penyedia/add"
                  element={<TambahPenyedia />}
                />
                <Route
                  path="master-data-penyedia/edit/:id"
                  element={<EditPenyedia />}
                />

                <Route path="master-data-provinsi" element={<DataProvinsi />} />
                <Route
                  path="master-data-provinsi/add"
                  element={<TambahProvinsi />}
                />
                <Route
                  path="master-data-provinsi/edit/:id"
                  element={<EditProvinsi />}
                />

                <Route path="master-data-kota" element={<DataKota />} />
                <Route
                  path="master-data-kota/detail/:id"
                  element={<DetailProvinsi />}
                />
                <Route path="master-data-kota/add" element={<TambahKota />} />
                <Route
                  path="master-data-kota/edit/:id"
                  element={<EditKota />}
                />

                <Route
                  path="master-data-kecamatan"
                  element={<DataKecamatan />}
                />
                <Route
                  path="master-data-kecamatan/detail/:id/:idKota"
                  element={<DetailKota />}
                />
                <Route
                  path="master-data-kecamatan/detail/:id"
                  element={<DetailProvinsiKota />}
                />
                <Route
                  path="master-data-kecamatan/add"
                  element={<TambahKecamatan />}
                />
                <Route
                  path="master-data-kecamatan/edit/:id"
                  element={<EditKecamatan />}
                />
              </Route>
            </Route>
          </Route>
          <Route
            path="login"
            element={
              <GoogleReCaptchaProvider
                reCaptchaKey={import.meta.env.VITE_APP_SITE_KEY}
              >
                <Login />
              </GoogleReCaptchaProvider>
            }
          />
          \
          <Route path="*" exact={true} element={<NotFound />} />
        </Routes>
      </Wrapper>
      <ScrollToTop />
    </>
  );
}

export default App;
