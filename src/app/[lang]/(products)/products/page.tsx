import { Products } from "./components/Products/Products";
import { get } from "@/lib/api/get-function";
import { IProduct } from "@/interfaces/product.interface";
import { NextPage } from "next";
import { ICompany } from "@/interfaces/company.interface";
import {cookies} from "next/headers";

const ProductsPage: NextPage<{ params: any; searchParams: any }> = async ({
  searchParams,
  params,
}) => {
  const { productId, companyId } = await searchParams;
  const cookieStore = await cookies();
  const { lang } = await params;
  const products = await get<IProduct[]>({ url: "products" });
  const companies = await get<ICompany[]>({
    url: "companies",
    queryParameters: { productId, locale: lang, id: companyId, country: cookieStore.get('test')?.value } as unknown as any,
  });
  const allCompany = await get<ICompany[]>({
    url: "companies",
    queryParameters: { productId, country: cookieStore.get('test')?.value } as unknown as any,
  });


  return (
    <div>
      <Products
        locale={lang}
        allCompanies={allCompany}
        products={products}
        activeProductId={Number(productId)}
        companies={companies}
      />
    </div>
  );
};

export default ProductsPage;
