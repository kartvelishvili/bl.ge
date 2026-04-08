import { get } from "@/lib/api/get-function";
import { NextPage } from "next";
import { IProductItem } from "@/interfaces/product-item.interface";
import { VinificationViewer } from "./VinificationViewer";

const VinificationPage: NextPage<{ params: any }> = async ({ params }) => {
  const { id, lang } = await params;
  const item = await get<IProductItem>({ url: "product-items", id });

  if (!item || !item.vinification?.url) {
    return (
      <div style={{ color: "#fff", textAlign: "center", padding: "80px 20px", fontFamily: "DejaVuSans" }}>
        Not found
      </div>
    );
  }

  return (
    <VinificationViewer
      pdfUrl={item.vinification.url}
      productName={item.name?.[lang as "ge" | "en" | "ru"] || item.name?.ge || ""}
      productId={item.id}
      locale={lang}
    />
  );
};

export default VinificationPage;
