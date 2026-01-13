import Select from "react-select";
import { selectThemeColors } from "../../../../data/utils";

export default function FormSelect({ label, placeholder, isMulti, ...props }) {
  return (
    <div>
      {" "}
      <label className="text-xs text-[#272b2f] font-semibold mb-1 block">
        {" "}
        {label}{" "}
      </label>{" "}
      <Select
        className="text-sm"
        theme={selectThemeColors}
        placeholder={
          placeholder ??
          (isMulti ? "Pilih satu atau lebih opsi" : "Pilih salah satu")
        }
        isMulti={isMulti}
        {...props}
      />{" "}
    </div>
  );
}
