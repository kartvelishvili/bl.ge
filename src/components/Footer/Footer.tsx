import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import Copyright from "@/components/Footer/components/CopyRight/Copyright";
import ContactUs from "@/components/Footer/components/ContactUs/ContactUs";
import { FC } from "react";
import { LocaleType } from "@/types/locale.type";
import { get } from "@/lib/api/get-function";
import { IProduct } from "@/interfaces/product.interface";
import FooterBackground from "@/../public/images/management-team-back.png";

interface Props {
  dictionary: Record<string, string>;
  locale: LocaleType;
}

const Footer: FC<Props> = async (props) => {
  const products = await get<IProduct[]>({ url: "products" });

  return (
    <ContentWrapper
      wrapperClasses="sm:h-fit pt-4 sm:pt-8 md:pt-12 pb-4 sm:pb-8 bg-[#191D22] mt-12 border-t-2 border-[#D2AE6D33] mt-[356px]"
      wrapperClassesInline={{
        backgroundImage: `url(${FooterBackground.src})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right top",
      }}
      contentClasses="flex flex-col md:gap-8 sm:gap-4 gap-12 items-center md:justify-end justify-center"
    >
      <ContactUs
        dictionary={props.dictionary}
        locale={props.locale}
        products={products}
      />
      <Copyright dictionary={props.dictionary} />
    </ContentWrapper>
  );
};

export default Footer;
