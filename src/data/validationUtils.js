// src/utils/validationUtils.js
import Swal from "sweetalert2";
import DOMPurify from "dompurify";

// Validasi XSS
export const validateInput = (input) => {
    if (!input) return true;

    // Ubah ke string jika input bukan string
    const sanitized = DOMPurify.sanitize(String(input));

    return sanitized === String(input);
};
// Validasi format file wajib
export const validateRequiredFile = (file, allowedTypes, fieldName) => {
    if (!file) {
        Swal.fire("Warning", `${fieldName} wajib diunggah!`, "warning");
        return false;
    }
    return validateFileFormat(file, allowedTypes, fieldName);
};


// Validasi format file opsional
export const validateFileFormat = (file, allowedTypes, maxSizeMB, fieldName, isRequired = true) => {
    if (!file) {
        if (isRequired) {
            Swal.fire("Error", `File ${fieldName} wajib diunggah!`, "error");
            return false;
        }
        return true; // Jika tidak wajib, tetap valid
    }
    if (typeof file === "string" && file.startsWith("http")) return true;

    const fileExt = file.name.split(".").pop().toLowerCase();
    const mimeType = file.type;
    const fileSize = file.size;
    const reader = new FileReader();

    // Cek ekstensi dan MIME type
    if (!allowedTypes.includes(fileExt) || !allowedTypes.includes(mimeType.split("/")[1])) {
        Swal.fire("Warning", `${fieldName} harus dalam format ${allowedTypes.join(", ").toUpperCase()}!`, "warning");
        return false;
    }

    // Cek ukuran file
    if (fileSize > maxSizeMB * 1024 * 1024) {
        Swal.fire("Warning", `${fieldName} tidak boleh lebih dari ${maxSizeMB}MB!`, "warning");
        return false;
    }

    // Cek isi file untuk payload berbahaya (XSS/script injection)
    return new Promise((resolve) => {
        reader.onload = (e) => {
            const fileContent = e.target.result;

            // Deteksi payload berbahaya dalam teks file
            const forbiddenPatterns = [
                /<script[\s\S]*?>/gi, // Script tag
                /javascript:/gi, // JavaScript URI scheme
                /onerror\s*=/gi, // Event handler onerror
                /eval\s*\(/gi, // Eval function
                /<iframe[\s\S]*?>/gi, // Iframe injection
                /<object[\s\S]*?>/gi, // Object injection
            ];

            for (const pattern of forbiddenPatterns) {
                if (pattern.test(fileContent)) {
                    Swal.fire("Warning", `${fieldName} mengandung kode berbahaya!`, "warning");
                    resolve(false);
                    return;
                }
            }

            resolve(true);
        };

        reader.readAsText(file);
    });
};


// Validasi form input secara umum
export const validateForm = (formData, fields) => {
    for (const field of fields) {
        if (!validateInput(formData[field])) {
            Swal.fire("Warning", `Format ${field} tidak sesuai atau mengandung karakter berbahaya!`, "warning");
            return false;
        }
    }
    return true;
};
