import React from "react";

const Card = ({ children, className }) => {
  return (
    <div
      className={`rounded-md gap-4 border border-stroke bg-white py-4 md:py-8 lg:px-12 lg:py-12 px-4 md:px-8 shadow-default dark:border-strokedark dark:bg-boxdark ${className} `}
    >
      {children}
    </div>
  );
};

export default Card;
