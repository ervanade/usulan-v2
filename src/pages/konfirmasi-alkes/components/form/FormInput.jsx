export default function FormInput({ label, helper, type = "text", ...props }) {
  return (
    <div>
      {" "}
      <label className="text-xs text-[#272b2f] font-semibold mb-1 block">
        {" "}
        {label}{" "}
      </label>{" "}
      <input
        type={type}
        className="w-full border border-[#cacaca] rounded-md px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
        {...props}
      />{" "}
      {helper && <p className="text-xs text-[#728294] mt-1">{helper}</p>}{" "}
    </div>
  );
}
