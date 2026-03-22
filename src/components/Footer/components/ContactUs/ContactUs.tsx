import FooterContactInfo from "@/components/Footer/components/FooterContactInfo/FooterContactInfo";
import { FC } from "react";
import Link from "next/link";
import { LocaleType } from "@/types/locale.type";
import { MENU_ITEMS } from "@/components/Header/components/Menu/utils/menu-items";
import { IProduct } from "@/interfaces/product.interface";

interface Props {
  dictionary: Record<string, string>;
  locale: LocaleType;
  products: IProduct[];
}

const ContactUs: FC<Props> = (props) => {
  return (
    <div className="w-full flex items-start justify-between md:gap-0 gap-8 md:p-0 sm:p-0 flex-wrap">
      <FooterContactInfo dictionary={props.dictionary} />
        <div className="flex gap-12 md:gap-32 items-start flex-col sm:flex-row justify-start sm:justify-center">
            <ul className="flex flex-col items-start justify-center gap-4">
                {MENU_ITEMS.map((item) => (
                    <li
                        className="font-notoSansGeoSemi sm:text-sm md:text-base text-white"
                        key={item.href}
                    >
                        <Link href={`/${props.locale}${item.href}`}>
                            {props.dictionary[item.content]}
                        </Link>
                    </li>
                ))}
            </ul>
            <ul className="flex flex-col items-start justify-center gap-4">
                {props.products.map((item) => (
                    <li
                        className="font-notoSansGeoSemi sm:text-sm md:text-base text-white"
                        key={item.id}
                    >
                        <Link href={`/${props.locale}/products?productId=${item.id}`}>
                            {item.name?.[props.locale]}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );
};

export default ContactUs;
