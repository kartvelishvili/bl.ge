"use client";

import { useForm } from "react-hook-form";
import Input from "@/components/Input/Input";
import { createApi } from "@/lib/api/crud-operations";
import {FC} from "react";

interface Props {
  dictionary: Record<string, string>;
}

const ContactForm: FC<Props> = (props) => {
  const { control, handleSubmit, reset } = useForm();

  const onSubmit = async (values: any) => {
    const res = await createApi("contact-us", values);
    reset({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      text: "",
    });
  };

  return (
    <div className="sm:w-[562px] w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-start justify-center gap-8">
          <div className="flex flex-col items-start justify-center md:gap-6 gap-5 w-full">
            <div className="flex items-center justify-between w-full md:gap-8 gap-5 md:flex-nowrap flex-wrap">
              <Input
                type={"text"}
                placeholder={props.dictionary?.['სახელი']}
                name={"firstName"}
                className="w-full"
                control={control}
              />
              <Input
                type={"text"}
                placeholder={props.dictionary?.['გვარი']}
                name={"lastName"}
                className="w-full"
                control={control}
              />
            </div>
            <div className="md:w-1/2 w-full flex-wrap flex flex-col items-start justify-center md:gap-6 gap-5 md:pr-4 pr-0">
              <Input
                type={"text"}
                placeholder={props.dictionary?.['მობილურის ნომერი']}
                name={"phoneNumber"}
                className="w-full"
                control={control}
              />
              <Input
                type={"email"}
                placeholder={props.dictionary?.['მეილის მისამართი']}
                name={"email"}
                className="w-full"
                control={control}
              />
            </div>
            <Input
              type={"text"}
              placeholder={props.dictionary?.['ტექსტი...']}
              name={"text"}
              className="w-full"
              control={control}
            />
          </div>
          <button
            type="submit"
            className="py-2 px-4  bg-[#FFFFFF1A] ransition-all duration-300 ease-in-out hover:bg-[#D2AE6D33] font-dejavuSans font-extralight font-base/6 w-[162px] rounded-lg"
          >
            {props.dictionary?.['ᲒᲐᲒᲖᲐᲕᲜᲐ']}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
