"use client";

import { useForm } from "react-hook-form";
import Input from "@/components/Input/Input";

const ContactForm = () => {
    const { control } = useForm();

    return (
        <div className="md:w-[562px] w-fit">
            <form>
                <div className='flex flex-col items-start justify-center gap-8'>
                    <div className="flex flex-col items-start justify-center md:gap-6 gap-5 w-full">
                        <div className="flex items-center justify-between w-full md:gap-8 gap-5 md:flex-nowrap flex-wrap">
                            <Input
                                type={"text"}
                                placeholder={"სახელი"}
                                name={"firstName"}
                                className="w-full"
                                control={control}
                            />
                            <Input
                                type={"text"}
                                placeholder={"გვარი"}
                                name={"lastName"}
                                className="w-full"
                                control={control}
                            />
                        </div>
                        <div className="md:w-1/2 w-full flex-wrap flex flex-col items-start justify-center md:gap-6 gap-5 md:pr-4 pr-0">
                            <Input
                                type={"text"}
                                placeholder={"მობილურის ნომერი"}
                                name={"phoneNumber"}
                                className="w-full"
                                control={control}
                            />
                            <Input
                                type={"email"}
                                placeholder={"მეილის მისამართი"}
                                name={"email"}
                                className="w-full"
                                control={control}
                            />
                        </div>
                        <Input
                            type={"text"}
                            placeholder={"ტექსტი..."}
                            name={"text"}
                            className="w-full"
                            control={control}
                        />
                    </div>
                    <button type='submit' className='py-2 px-4 bg-[#FFFFFF1A]  font-dejavuSans font-extralight font-base/6 w-[162px] rounded-lg'>ᲒᲐᲒᲖᲐᲕᲜᲐ</button>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;
