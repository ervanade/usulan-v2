// Import script untuk XLSX dan moment melalui importScripts
importScripts(
    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js'
);

// Fungsi untuk memproses data dalam chunks
async function processInChunks(data, chunkSize, callback) {
    const totalRows = data.length;
    const chunks = Math.ceil(totalRows / chunkSize);

    let processedData = [];

    for (let i = 0; i < chunks; i++) {
        const start = i * chunkSize;
        const end = start + chunkSize;
        const chunk = data.slice(start, end);

        // Transform data
        const transformed = chunk.map(item => ({
            Provinsi: item.provinsi || "",
            Kabupaten: item.kabupaten || "",
            Puskesmas: item.nama_puskesmas || "",
            Kode_Puskesmas: item.kode_pusdatin_baru || "",
            "Nama Alkes": item.nama_alkes || "",
            "Jumlah Eksisting": item.berfungsi || 0,
            "Jumlah Usulan": item.usulan || 0,
        }));

        processedData = processedData.concat(transformed);

        // Laporkan progress
        const progress = Math.round(((i + 1) / chunks) * 100);
        self.postMessage({
            type: 'PROGRESS',
            payload: progress
        });

        // Beri kesempatan untuk event loop
        if (i % 5 === 0) {
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }

    return processedData;
}

// Event listener untuk pesan dari main thread
self.onmessage = async (event) => {
    const { type, payload } = event.data;

    if (type === 'START_EXPORT') {
        try {
            // 1. Fetch data dari API
            const response = await fetch(payload.apiUrl, {
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

            // 2. Proses data dalam chunks
            const processedData = await processInChunks(data.data, 10000);

            // 3. Buat workbook
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(processedData);

            // Set column width
            ws['!cols'] = [
                { wch: 20 }, // Provinsi
                { wch: 20 }, // Kabupaten
                { wch: 30 }, // Puskesmas
                { wch: 15 }, // Kode_Puskesmas
                { wch: 40 }, // Nama Alkes
                { wch: 15 }, // Jumlah Eksisting
                { wch: 15 }, // Jumlah Usulan
            ];

            XLSX.utils.book_append_sheet(wb, ws, "Data Alkes");

            // 4. Export ke file binary
            const fileName = `Data_Usulan_Semua_${moment().format("YYYY-MM-DD_HH-mm")}.xlsx`;
            const fileData = XLSX.write(wb, { bookType: 'xlsx', type: 'array', compression: true });

            // 5. Kirim hasil ke main thread
            self.postMessage({
                type: 'SUCCESS',
                payload: {
                    fileName,
                    fileData,
                    rowCount: processedData.length
                }
            });

        } catch (error) {
            self.postMessage({
                type: 'ERROR',
                payload: {
                    message: error.message
                }
            });
        }
    }
};