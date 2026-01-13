import {
  sdmList,
  yaTidakOptions,
  strategiOptions,
  skemaRelokasiOptions,
  alasanRelokasiOptions,
} from "./konfirmasi.constants";

import FormSelect from "../../components/form/FormSelect";
import FormInput from "../../components/form/FormInput";
import ReadOnly from "../../components/form/ReadOnly";

export default function KonfirmasiForm({
  formData,
  sdmChecked,
  setSdmChecked,
  sdmNama,
  setSdmNama,
  kesiapanSDM,
  upayaSDM,
  setUpayaSDM,
  strategi,
  setStrategi,
  sarpras,
  setSarpras,
  alkes,
  setAlkes,
  relokasi,
  skemaRelokasi,
  setSkemaRelokasi,
  alasanRelokasi,
  setAlasanRelokasi,
}) {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <ReadOnly label="Provinsi" value={formData.provinsi} />
        <ReadOnly label="Kab/Kota" value={formData.kabKota} />
        <ReadOnly label="Kode Puskesmas" value={formData.kode} />
        <ReadOnly label="Nama Puskesmas" value={formData.puskesmas} />
        <ReadOnly label="Nama Alkes" value={formData.alat} />
        <ReadOnly label="Jumlah" value={formData.jumlah} />
      </div>

      {/* SDM DIMILIKI */}
      <section className="mt-8">
        <h2 className="font-semibold mb-3">SDM Dimiliki Puskesmas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {sdmList.map((s) => {
            const checked = sdmChecked.includes(s);
            return (
              <div
                key={s}
                className={`border p-3 rounded-md ${
                  checked ? "border-primary bg-primary/5" : ""
                }`}
              >
                <label className="flex gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setSdmChecked((p) =>
                        p.includes(s) ? p.filter((x) => x !== s) : [...p, s]
                      )
                    }
                  />
                  {s}
                </label>

                {checked && (
                  <input
                    className="mt-2 w-full border rounded px-2 py-1 text-sm"
                    placeholder={`Nama ${s}`}
                    value={sdmNama[s] || ""}
                    onChange={(e) =>
                      setSdmNama({ ...sdmNama, [s]: e.target.value })
                    }
                  />
                )}
              </div>
            );
          })}
        </div>
      </section>

      <ReadOnly label="Kesiapan SDMK" value={kesiapanSDM} />

      {kesiapanSDM === "Tidak" && (
        <section className="mt-6 grid grid-cols-2 gap-4">
          <FormSelect
            label="Upaya Pemenuhan SDM"
            options={yaTidakOptions}
            value={upayaSDM}
            onChange={setUpayaSDM}
          />
          {upayaSDM?.value === "Ya" && (
            <FormSelect
              label="Strategi Pemenuhan SDM"
              isMulti
              options={strategiOptions}
              value={strategi}
              onChange={setStrategi}
            />
          )}
        </section>
      )}
    </>
  );
}
