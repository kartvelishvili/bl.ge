import { FC } from "react";
import Header from "@/components/Header/Header";
import { getDictionary } from "@/app/dictionaries/dictionaries";
import AboutUsBanner from "@/app/[lang]/(about-us)/components/AboutUsBanner/AboutUsBanner";

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
            <AboutUsBanner dictionary={JSON.parse(JSON.stringify(dictionary))} />
            <div className="sm:mt-16 mt-10 md:mt-[117px] flex flex-col">
                {children}
            </div>
        </div>
    );
};
export default VideoLayout;
