import Header from "@/components/Header/Header";
import { FC } from "react";
import {getDictionary} from "@/app/dictionaries/dictionaries";

const WithoutVideoLayout: FC<
  Readonly<{
    children: React.ReactNode;
    params: any
  }>
> = async ({ children, params }) => {
   const { lang } = await params;
   const dictionary = await getDictionary(lang) as any;

  return (
    <div>
      <Header bgColor="bg-[#191D22]" dictionary={JSON.parse(JSON.stringify(dictionary))} lang={lang} />
      <div className="sm:mt-16 mt-10 md:mt-[117px]">{children}</div>
    </div>
  );
};

export default WithoutVideoLayout;
