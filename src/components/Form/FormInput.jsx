import React from "react";
import { selectThemeColors } from "../../data/utils";
import Select from "react-select";

const FormInput = ({
  value,
  onChange,
  className,
  required,
  type,
  label,
  name,
  id,
  placeholder,
  select,
  options,
  isDisabled,
}) => {
  return (
    <div className="mb-8 flex-col sm:flex-row sm:gap-8 flex sm:items-center">
      <div className="sm:flex-[2_2_0%]">
        <label
          className="block text-[#728294] text-base font-normal mb-2"
          htmlFor={id ? id : ""}
        >
          {label ? label : ""}
        </label>
      </div>
      <div className="sm:flex-[5_5_0%]">
        {select ? (
          <Select
            options={options}
            value={value ? value : ""}
            onChange={onChange ? onChange : ""}
            placeholder={placeholder}
            isDisabled={isDisabled ? isDisabled : false}
            className="w-full"
            theme={selectThemeColors}
          />
        ) : (
          <input
            className={`sm:flex-[5_5_0%] bg-white appearance-none border border-[#cacaca] focus:border-[#0ACBC2]
      "border-red-500" 
   rounded-md w-full py-3 px-3 text-[#728294] leading-tight focus:outline-none focus:shadow-outline dark:bg-transparent`}
            id={id ? id : ""}
            value={value ? value : ""}
            onChange={onChange ? onChange : ""}
            type={type ? type : "text"}
            required={required ? required : false}
            placeholder={placeholder ? placeholder : ""}
          />
        )}
      </div>
    </div>
  );
};

export default FormInput;
