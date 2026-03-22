import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { BoleroWines } from "@/app/[lang]/(products)/products/components/BoleroWines/BoleroWines";
import { get } from "@/lib/api/get-function";
import { NextPage } from "next";
import { IProductItem } from "@/interfaces/product-item.interface";
import {getDictionary} from "@/app/dictionaries/dictionaries";

const SingleWinePage: NextPage<{ params: any }> = async ({ params }) => {
  const { id, lang } = await params;

  const wine = await get<IProductItem>({ url: "product-items", id });
  const similarItems = await get<IProductItem[]>({
    url: "product-items/random",
    id,
  });
  const dictionary = await getDictionary(lang) as any;

  return (
    <>
      <ContentWrapper>
        <BoleroWines locale={lang} item={wine} similarItems={similarItems} dictionary={JSON.parse(JSON.stringify(dictionary))} />
      </ContentWrapper>
    </>
  );
};

export default SingleWinePage;
