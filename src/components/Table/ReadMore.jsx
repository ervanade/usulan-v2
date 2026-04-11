import React, { useState } from "react";

const ReadMore = ({ text, limit = 50 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return "-";
  if (text.length <= limit) return text;

  return (
    <div className="text-wrap">
      {isExpanded ? text : `${text.substring(0, limit)}...`}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className="ml-1 text-primary hover:underline font-semibold focus:outline-none block mt-1"
      >
        {isExpanded ? "Lihat Lebih Sedikit" : "Lihat Selengkapnya"}
      </button>
    </div>
  );
};

export default ReadMore;
