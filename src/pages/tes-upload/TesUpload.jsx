import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useDropzone } from "react-dropzone";
import { PDFDocument } from "pdf-lib";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useSelector } from "react-redux";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

const TesUpload = () => {
  const [pdfDocument, setPdfDocument] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const user = useSelector((a) => a.auth.user);
  const [tteImages, setTteImages] = useState([]);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [pdfScale, setPdfScale] = useState(1); // Track the scale of the PDF
  const containerRef = useRef(null);
  const canvasRef = useRef(null); // Canvas reference for scale calculation

  useEffect(() => {
    const tte = user?.ttd;
    if (tte) {
      setTteImages([{ url: tte, x: 200, y: 100 }]);
    }
  }, []);

  useEffect(() => {
    // Reset TTE position when page changes
    setTteImages((images) =>
      images.map((image) => ({
        ...image,
        x: 200,
        y: 100,
      }))
    );
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      const pdfData = new Uint8Array(reader.result);
      const blob = new Blob([pdfData], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(blob);
      setPdfDocument(pdfUrl);
    };

    reader.readAsArrayBuffer(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".pdf",
  });

  const handleAddTte = () => {
    const tte = user?.ttd;
    if (tte) {
      setTteImages((images) => [...images, { url: tte, x: 200, y: 100 }]);
    } else {
      alert("TTE belum diupload.");
    }
  };

  const handleDragStart = (event, index) => {
    event.preventDefault();
    setDraggingIndex(index);
    setDragStart({ x: event.clientX, y: event.clientY });
    setDragOffset({
      x: tteImages[index].x,
      y: tteImages[index].y,
    });
  };

  const handleDrag = (event) => {
    if (draggingIndex !== null) {
      const x = event.clientX - dragStart.x + dragOffset.x;
      const y = event.clientY - dragStart.y + dragOffset.y;

      setTteImages((images) =>
        images.map((image, index) =>
          index === draggingIndex ? { ...image, x: x, y: y } : image
        )
      );
    }
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  useEffect(() => {
    if (draggingIndex !== null) {
      const handleMouseMove = (event) => handleDrag(event);
      const handleMouseUp = () => handleDragEnd();

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [draggingIndex]);

  const handleSave = async () => {
    if (!pdfDocument || tteImages.length === 0) return;

    // Load PDF
    const pdfBytes = await fetch(pdfDocument).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);

    for (const image of tteImages) {
      const tteImageBytes = await fetch(image.url).then((res) =>
        res.arrayBuffer()
      );
      let tteImage;

      const imgType = image.url.split(".").pop().toLowerCase(); // Detect based on extension
      if (imgType === "png") {
        tteImage = await pdfDoc.embedPng(tteImageBytes);
      } else if (imgType === "jpeg" || imgType === "jpg") {
        tteImage = await pdfDoc.embedJpg(tteImageBytes);
      } else {
        alert("Unsupported image format.");
        return;
      }

      const page = pdfDoc.getPage(currentPage - 1);
      const { width, height } = page.getSize();
      const imgWidth = 60;
      const imgHeight = 60;

      const x = Number(image.x) / Number(pdfScale) - 82;
      const y = height - Number(image.y) / Number(pdfScale) - imgHeight + 115;

      if (!isNaN(x) && !isNaN(y) && x >= 0 && y >= 0) {
        page.drawImage(tteImage, {
          x,
          y,
          width: imgWidth,
          height: imgHeight,
        });
      }
    }

    const pdfBytesWithTTE = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytesWithTTE], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(pdfBlob);

    window.open(pdfUrl, "_blank");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full">
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 p-4 mb-4 text-center cursor-pointer"
        >
          <input {...getInputProps()} />
          <p className="text-gray-700">Drag & drop your PDF document here</p>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <button
            onClick={handleAddTte}
            className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition"
          >
            Tambah TTE
          </button>
        </div>

        {pdfDocument && (
          <div className="relative">
            <div className="mb-4 flex justify-between items-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition disabled:bg-gray-300"
              >
                Previous
              </button>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => handlePageChange(Number(e.target.value))}
                className="border border-gray-300 px-2 py-1 rounded text-center"
              />
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition disabled:bg-gray-300"
              >
                Next
              </button>
            </div>

            <div className="bg-gray-200 p-4 rounded-lg overflow-auto">
              <Document
                file={pdfDocument}
                onLoadSuccess={({ numPages, originalWidth }) => {
                  setTotalPages(numPages);
                  setPdfScale(1);
                }}
              >
                <Page
                  key={`page_${currentPage}`}
                  pageNumber={currentPage}
                  className="w-full h-auto"
                  scale={1.5}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  canvasRef={canvasRef}
                />
              </Document>
            </div>

            {tteImages.map((tte, index) => (
              <div
                key={index}
                className="tte moving-border absolute"
                style={{
                  left: tte.x,
                  top: tte.y,
                  cursor: draggingIndex === index ? "grabbing" : "grab",
                  pointerEvents: draggingIndex === index ? "none" : "auto",
                  border: "2px dashed rgba(0, 0, 0, 0.5)",
                  borderRadius: "4px",
                }}
                onMouseDown={(event) => handleDragStart(event, index)}
                onMouseMove={handleDrag}
                onMouseUp={handleDragEnd}
              >
                <img
                  src={tte.url}
                  alt="TTE"
                  className="w-20 h-20"
                  style={{ pointerEvents: "none" }}
                />
              </div>
            ))}

            <button
              onClick={handleSave}
              className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition mt-4"
            >
              Save Document
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TesUpload;
