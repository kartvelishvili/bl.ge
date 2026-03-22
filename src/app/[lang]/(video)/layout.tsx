import { FC } from "react";
import MainBanner from "@/app/[lang]/(video)/components/MainBanner";
import Header from "@/components/Header/Header";
import { getDictionary } from "@/app/dictionaries/dictionaries";

const VideoLayout: FC<
  Readonly<{
    children: React.ReactNode;
    params: any;
  }>
> = async ({ children, params }) => {
  const { lang } = await params;
  const dictionary = await getDictionary(lang) as any;


    return (
    <div>
      <Header dictionary={JSON.parse(JSON.stringify(dictionary))} lang={lang} />
      <MainBanner />
      <div className="sm:mt-16 mt-10 md:mt-[117px] flex flex-col">
        {children}
      </div>
    </div>
  );
};
export default VideoLayout;
