// Import script untuk XLSX dan moment melalui importScripts
importScripts(
    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js'
);

// Fungsi untuk memproses data dalam chunks
async function processInChunks(data, chunkSize, isProvinceExport) {
    const totalRows = data.length;
    const chunks = Math.ceil(totalRows / chunkSize);
    let processedData = [];

    for (let i = 0; i < chunks; i++) {
        const start = i * chunkSize;
        const end = start + chunkSize;
        const chunk = data.slice(start, end);

        const transformed = chunk.map(item => {
            const baseItem = {
                Provinsi: item.provinsi || "",
                Kabupaten: item.kabupaten || "",
                Puskesmas: item.nama_puskesmas || "",
                Kode_Puskesmas: item.kode_pusdatin_baru || "",
                "Nama Alkes": item.nama_alkes || "",
                "Jumlah Eksisting": item.berfungsi || 0,
                "Jumlah Usulan": item.usulan || 0,
            };
            if (isProvinceExport) {
                return { ...baseItem, "Kriteria Puskesmas": item.kriteria || "" };
            }
            return baseItem;
        });

        processedData = processedData.concat(transformed);

        const progress = Math.round(((i + 1) / chunks) * 100);
        self.postMessage({ type: 'PROGRESS', payload: progress });

        if (i % 5 === 0) {
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }
    return processedData;
}

// Event listener untuk pesan dari main thread
self.onmessage = async (event) => {
    const { type, payload } = event.data;
    const isProvinceExport = payload.exportType === 'province';

    if (type === 'START_EXPORT') {
        try {
            const apiUrl = isProvinceExport && payload.provinceId
                ? `https://api.alkesihss.com/api/lapalkes/provinsi/${payload.provinceId}`
                : payload.apiUrl; // Gunakan apiUrl asli untuk export semua

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${payload.token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (!data?.data) {
                throw new Error("Data tidak valid");
            }

            const processedData = await processInChunks(data.data, 10000, isProvinceExport);

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(processedData);
            let cols = [
                { wch: 20 }, { wch: 20 }, { wch: 30 },
                { wch: 20 }, { wch: 30 }, { wch: 15 }, { wch: 15 },
                isProvinceExport ? { wch: 40 } : null, // Kriteria Puskesmas
            ].filter(Boolean);
            ws['!cols'] = cols;
            XLSX.utils.book_append_sheet(wb, ws, "Data Alkes");

            let fileName;
            if (isProvinceExport && payload.provinceName) {
                fileName = `Data_Usulan_${payload.provinceName.replace(/\s/g, '_')}_${moment().format("YYYY-MM-DD_HH-mm")}.xlsx`;
            } else {
                fileName = `Data_Usulan_Semua_${moment().format("YYYY-MM-DD_HH-mm")}.xlsx`;
            }
            const fileData = XLSX.write(wb, { bookType: 'xlsx', type: 'array', compression: true });

            self.postMessage({
                type: 'SUCCESS',
                payload: {
                    fileName,
                    fileData,
                    rowCount: processedData.length
                }
            });

        } catch (error) {
            self.postMessage({ type: 'ERROR', payload: { message: error.message } });
        }
    }
};