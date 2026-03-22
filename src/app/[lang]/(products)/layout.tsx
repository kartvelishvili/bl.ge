import { FC } from "react";
import Header from "@/components/Header/Header";
import { getDictionary } from "@/app/dictionaries/dictionaries";
import ProductBanner from "@/app/[lang]/(products)/components/ProductBanner";

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
            <ProductBanner />
            <div className="sm:mt-16 mt-10 md:mt-[117px] flex flex-col">
                {children}
            </div>
        </div>
    );
};
export default VideoLayout;
