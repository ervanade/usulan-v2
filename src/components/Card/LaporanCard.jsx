import React from "react";

const LaporanCard = ({ title, total }) => {
  return (
    <div className="rounded-md items-center justify-between border border-stroke bg-white py-4 md:py-6 px-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-col items-center justify-center">
        <h3
          className={`text-sm md:text-lg 2xl:text-xl text-bodydark1 font-bold text-center`}
        >
          {title || "Data"}
        </h3>
        <h4
          className={`xl:text-xl font-semibold mt-2 dark:text-white text-center text-[#16B3AC] `}
        >
          {total || 0}
        </h4>
      </div>
    </div>
  );
};

export default LaporanCard;
