import PopularWines from "@/components/PopularWines/PopularWines";
import WineInfo from "@/components/WineInfo/WineInfo";
import WineSlider from "@/components/WineSlider/WineSlider";
import { get } from "@/lib/api/get-function";
import { IProduct } from "@/interfaces/product.interface";
import { NextPage } from "next";
import { IProductItem } from "@/interfaces/product-item.interface";
import { IBlog } from "@/interfaces/blog.interface";
import { BlogTypeEnum } from "@/enums/blog-type.enum";
import { getDictionary } from "@/app/dictionaries/dictionaries";
import TimeLine from "@/components/TimeLine/TimeLine";
import { ICompany } from "@/interfaces/company.interface";
import TimeLineBackground from "@/../public/images/timeline-background.png";
import ProductsGrid from "@/app/[lang]/(video)/components/ProductsGrid";
import { cookies } from "next/headers";

const MainPage: NextPage<{ params: any }> = async ({ params }) => {
  const { lang } = await params;
  const cookieStore = await cookies();
  const products = await get<IProduct[]>({
    url: "products",
    queryParameters: { locale: lang },
  });
  const popularWines = await get<IProductItem[]>({
    url: "product-items",
    queryParameters: { isPopular: true } as any,
  });
  const aboutUsBlogs = await get<IBlog[]>({
    url: "blogs",
    queryParameters: { type: BlogTypeEnum.AboutUs, visibleOnHome: "true" },
  });
  const companies = await get<ICompany[]>({
    url: "companies",
    queryParameters: {
      country: cookieStore.get("test")?.value,
    } as unknown as any,
  });
  const dictionary = (await getDictionary(lang)) as any;

  return (
    <>
      <ProductsGrid
        locale={lang}
        products={products.map((p) => ({
          name: (p.name as any)[lang],
          image: p.file.url,
          id: p.id,
        }))}
      />
      <WineInfo
        blogs={aboutUsBlogs}
        dictionary={JSON.parse(JSON.stringify(dictionary))}
        locale={lang}
      />
      <PopularWines
          items={popularWines}
          locale={lang}
          dictionary={JSON.parse(JSON.stringify(dictionary))}
      />
      <WineSlider data={companies} locale={lang} />
      <TimeLine
        backgroundImageUrl={TimeLineBackground.src}
        locale={lang}
        dictionary={JSON.parse(JSON.stringify(dictionary))}
      />
    </>
  );
};

export default MainPage;
