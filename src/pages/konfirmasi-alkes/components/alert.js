import Swal from "sweetalert2";

export const showErrorAlert = (title, errors = []) => {
  return Swal.fire({
    icon: "error",
    title,
    html: `
      <div style="text-align:left;font-size:13px;">
        <ul style="padding-left:16px;margin:0;">
          ${errors.map((e) => `<li>${e}</li>`).join("")}
        </ul>
      </div>
    `,
    confirmButtonText: "OK",
    width: 420,
  });
};

export const showPayloadPreview = (payload) => {
  return Swal.fire({
    title: "Konfirmasi Simpan",
    icon: "info",
    html: `
      <div style="text-align:left;font-size:13px;">
        <p style="margin-bottom:8px;">
          Pastikan data berikut sudah benar sebelum disimpan:
        </p>

        <div style="
          background:#f8fafc;
          border:1px solid #e5e7eb;
          border-radius:6px;
          padding:10px;
          max-height:220px;
          overflow:auto;
          font-family:monospace;
          font-size:11px;
        ">
<pre style="margin:0;white-space:pre-wrap;">
${JSON.stringify(payload, null, 2)}
</pre>
        </div>

        <p style="margin-top:8px;font-size:12px;color:#64748b;">
          Data akan diproses setelah Anda menekan <b>YA, SIMPAN</b>.
        </p>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "YA, SIMPAN",
    cancelButtonText: "BATAL",
    confirmButtonColor: "#0ea5e9",
    cancelButtonColor: "#94a3b8",
    width: 520,
  });
};

export const showSuccessAlert = () => {
  return Swal.fire({
    icon: "success",
    title: "Berhasil",
    text: "Data berhasil diproses",
    timer: 2000,
    showConfirmButton: false,
  });
};
