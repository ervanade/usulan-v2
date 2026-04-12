import React from "react";
import DataTable from "react-data-table-component";
import { FaInfoCircle } from "react-icons/fa";
import { AlasanOptions } from "../../../data/data.js";

const UsulanItemsTable = ({
  data,
  columns,
  loading,
}) => {
  return (
    <div className="overflow-x-auto">
      <DataTable
        columns={columns}
        data={data}
        pagination
        paginationPerPage={100}
        paginationRowsPerPageOptions={[50, 100, 200]}
        striped
        defaultSortAsc={false}
        persistTableHead
        highlightOnHover
        pointerOnHover
        progressPending={loading}
        customStyles={{
          headCells: {
            style: {
              padding: 12,
              backgroundColor: "#0FAD91",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
            },
          },
          rows: {
            style: {
              fontSize: 14,
              paddingTop: 6,
              paddingBottom: 6,
              backgroundColor: "#FFFFFF",
              "&:nth-of-type(odd)": {
                backgroundColor: "#F9FAFB",
              },
              highlightOnHoverStyle: {
                backgroundColor: "#D1E8FF",
                color: "#212121",
              },
            },
          },
        }}
      />
    </div>
  );
};

export default UsulanItemsTable;
