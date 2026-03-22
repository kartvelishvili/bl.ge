import styles from "./Products.module.scss";
import { WineSection } from "../WineSection/WineSection";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { IProduct } from "@/interfaces/product.interface";
import Link from "next/link";
import { ICompany } from "@/interfaces/company.interface";
import { LocaleType } from "@/types/locale.type";
import Companies from "@/app/[lang]/(products)/products/components/Products/Companies";

interface Props {
  products: IProduct[];
  activeProductId: number;
  companies: ICompany[];
  locale: LocaleType;
  allCompanies: ICompany[];
}

export const Products: React.FC<Props> = (props) => {
  return (
    <ContentWrapper>
      <div className={styles.productPage}>
        <div className="flex flex-col sm:gap-8 gap-4">
          <div
            className={`flex items-center justify-between md:py-6 py-4 md:px-[124px] sm:px-[56px] px-6 ${styles.border}`}
          >
            {props.products.map((product) => (
              <Link
                key={product.id}
                scroll={false}
                href={`/${props.locale}/products?productId=${product.id}`}
                className={`font-notoSansGeoSemi text-sm sm:text-base md:text-2xl hover:text-[#D2AE6D] ${props.activeProductId === product.id ? "text-[#D2AE6D]" : "text-white"}`}
              >
                {product.name?.[props.locale]}
              </Link>
            ))}
          </div>
          <Companies companies={props.allCompanies} locale={props.locale} />
        </div>
        <div className={styles.productContent}>
          {props.companies.map((c) => {
            return (
              <WineSection
                key={c.id}
                iconSrc={c.activeFile?.url}
                wines={c.productItems}
                locale={props.locale}
                companyId={c.id}
              />
            );
          })}
        </div>
      </div>
    </ContentWrapper>
  );
};
