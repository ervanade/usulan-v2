import React from "react";
import Select from "react-select";
import {
  pelayananOptions,
  dayaOptions,
  SelectOptions,
} from "../../../data/data.js";
import { selectThemeColors } from "../../../data/utils.js";

const UsulanForm = ({
  formData,
  selectedPeriode,
  dataPeriode,
  handlePeriodeChange,
  pelayanan,
  handlePelayananChange,
  daya,
  handleDayaChange,
  listrik,
  handleListrikChange,
  internet,
  handleInternetChange,
  kriteria,
  dataKriteria,
  handleKriteriaChange,
  persalinan,
  handlePersalinanChange,
  poned,
  handlePonedChange,
  limbah,
  dataLimbah,
  handleLimbahChange,
  user,
  isAllowedKab,
  isDisabled,
}) => {
  return (
    <form className="mt-4 mb-8">
      <div className="gap-3 gap-y-4 grid grid-cols-2 md:grid-cols-3 mb-4">
        {/* Region Info (Read Only) */}
        {[
          { label: "Provinsi", value: formData.provinsi },
          { label: "Kabupaten / Kota", value: formData.kabupaten },
          { label: "Kecamatan", value: formData.kecamatan },
          { label: "Kode Puskesmas", value: formData.kode_pusdatin_baru },
          { label: "Puskesmas", value: formData.nama_puskesmas },
          { label: "Tahun", value: formData.tahun_lokus },
          { label: "Karakteristik Wilayah", value: formData.wilayah_kerja },
        ].map((field) => (
          <div key={field.label} className="flex-col gap-2 flex">
            <label className="block text-[#728294] text-sm font-semibold mb-1">
              {field.label} :
            </label>
            <input
              className="disabled:bg-slate-50 bg-white border border-[#cacaca] rounded-md w-full py-2 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline"
              value={field.value}
              disabled
              type="text"
              readOnly
            />
          </div>
        ))}
      </div>

      <div className="gap-3 gap-y-4 grid grid-cols-2 lg:grid-cols-4 mt-10 lg:mt-12">
        <div className="flex-col gap-2 flex">
          <label className="block text-[#728294] text-sm font-semibold mb-1">
            Jenis Pelayanan :
          </label>
          <Select
            options={pelayananOptions}
            value={pelayanan}
            onChange={handlePelayananChange}
            placeholder="Jenis Pelayanan"
            className="w-full text-sm"
            theme={selectThemeColors}
            isDisabled
          />
        </div>

        <div className="flex-col gap-2 flex">
          <label className="block text-[#728294] text-sm font-semibold mb-1">
            Ketersediaan Daya Listrik (PLN) :
          </label>
          <Select
            options={dayaOptions}
            value={daya}
            onChange={handleDayaChange}
            placeholder="Ketersediaan Daya"
            className="w-full text-sm"
            isDisabled={user?.role == "5" || isDisabled || !isAllowedKab}
            theme={selectThemeColors}
          />
        </div>

        <div className="flex-col gap-2 flex">
          <label className="block text-[#728294] text-sm font-semibold mb-1">
            Ketersediaan Listrik (24 Jam) :
          </label>
          <Select
            options={SelectOptions}
            value={listrik}
            onChange={handleListrikChange}
            placeholder="Ketersediaan Listrik"
            className="w-full text-sm"
            isDisabled={user?.role == "5" || isDisabled || !isAllowedKab}
            theme={selectThemeColors}
          />
        </div>

        <div className="flex-col gap-2 flex">
          <label className="block text-[#728294] text-sm font-semibold mb-1">
            Ketersediaan Internet :
          </label>
          <Select
            options={SelectOptions}
            value={internet}
            onChange={handleInternetChange}
            placeholder="Ketersediaan Internet"
            className="w-full text-sm"
            isDisabled={user?.role == "5" || isDisabled || !isAllowedKab}
            theme={selectThemeColors}
          />
        </div>
      </div>

      <div className="gap-3 gap-y-4 grid grid-cols-2 lg:grid-cols-3 mt-4 lg:mt-6">
        <div className="flex-col gap-2 flex">
          <label className="block text-[#728294] text-sm font-semibold mb-1">
            Puskesmas Persalinan :
          </label>
          <Select
            options={SelectOptions}
            value={persalinan}
            onChange={handlePersalinanChange}
            placeholder="Puskesmas Persalinan"
            className="w-full text-sm"
            isDisabled={user?.role == "5" || isDisabled || !isAllowedKab}
            theme={selectThemeColors}
          />
        </div>

        <div className="flex-col gap-2 flex">
          <label className="block text-[#728294] text-sm font-semibold mb-1">
            Puskesmas PONED :
          </label>
          <Select
            options={SelectOptions}
            value={poned}
            onChange={handlePonedChange}
            placeholder="Puskesmas PONED"
            className="w-full text-sm"
            isDisabled={user?.role == "5" || isDisabled || !isAllowedKab}
            theme={selectThemeColors}
          />
        </div>

        <div className="flex-col gap-2 flex">
          <label className="block text-[#728294] text-sm font-semibold mb-1">
            Pengelolaan Limbah :
          </label>
          <Select
            options={dataLimbah}
            value={limbah}
            onChange={handleLimbahChange}
            placeholder="Pengelolaan Limbah"
            isMulti
            className="w-full text-sm"
            isDisabled={user?.role == "5" || isDisabled || !isAllowedKab}
            theme={selectThemeColors}
          />
        </div>
      </div>

      <div className="gap-3 gap-y-4 grid grid-cols-2 lg:grid-cols-2 mt-4 lg:mt-4">
        <div className="flex-col gap-2 flex">
          <label className="block text-[#728294] text-sm font-semibold mb-1">
            SDM Tersedia :
          </label>
          <Select
            options={dataKriteria}
            value={kriteria}
            onChange={handleKriteriaChange}
            placeholder="SDM Tersedia"
            isMulti
            className="w-full text-sm"
            isDisabled={user?.role == "5" || isDisabled || !isAllowedKab}
            theme={selectThemeColors}
          />
        </div>

        <div className="flex-col gap-2 flex">
          <label className="block text-[#728294] text-sm font-semibold mb-1">
            Periode :
          </label>
          <Select
            options={dataPeriode}
            value={selectedPeriode}
            className="w-full text-sm"
            onChange={handlePeriodeChange}
            isDisabled={!user?.role == "1" || isDisabled || !isAllowedKab}
            placeholder="Pilih Periode"
            theme={selectThemeColors}
          />
        </div>
      </div>
    </form>
  );
};

export default UsulanForm;
