/* eslint-disable @typescript-eslint/no-explicit-any */

import { Control, Controller } from "react-hook-form";
import { FC } from "react";

interface Props {
  type: "text" | "email" | "number";
  placeholder?: string;
  name: string;
  control: Control<any>;
  className?: string;
}

const Input: FC<Props> = (props) => {
  return (
    <Controller
      render={({ field }) => (
        <input
          placeholder={props.placeholder}
          type={props.type}
          {...field}
          className={`${props.className}  bg-transparent p-0 m-0 border-b-[#3D4145] outline-none placeholder:font-dejavuSans placeholder:font-extralight placeholder:text-[rgba(255, 255, 255, 0.35)]`}
          style={{ borderBottomWidth: "0.5px" }}
        />
      )}
      name={props.name}
      control={props.control}
    />
  );
};

export default Input;
