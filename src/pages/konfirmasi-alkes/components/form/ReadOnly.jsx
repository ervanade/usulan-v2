export default function ReadOnly({ label, value }) {
  return (
    <div>
      {" "}
      <label className="text-xs text-[#3f4750] font-semibold">
        {label}
      </label>{" "}
      <div className="mt-1 border rounded-md px-3 py-2 bg-white text-sm text-[#3f4750] border-[#cacaca]">
        {" "}
        {value}{" "}
      </div>{" "}
    </div>
  );
}
