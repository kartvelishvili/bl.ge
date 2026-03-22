import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { CompanyEntity } from "@/lib/entities/company.entity";
import { ProductItemEntity } from "@/lib/entities/product-item.entity";
import { getAuthUser, requireAuth } from "@/lib/auth";

// GET /api/companies - public with product items
export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const companyRepo = db.getRepository(CompanyEntity);
    const piRepo = db.getRepository(ProductItemEntity);
    const { searchParams } = new URL(req.url);

    const name = searchParams.get("name");
    const productId = searchParams.get("productId");
    const id = searchParams.get("id");

    // Build company query
    const companyQb = companyRepo
      .createQueryBuilder("company")
      .leftJoinAndSelect("company.file", "file")
      .leftJoinAndSelect("company.secondaryFile", "secondaryFile")
      .leftJoinAndSelect("company.activeFile", "activeFile")
      .where("company.deletedAt IS NULL");

    if (name) {
      companyQb.andWhere("company.name LIKE :name", { name: `%${name}%` });
    }
    if (id) {
      companyQb.andWhere("company.id = :id", { id: Number(id) });
    }

    let companies = await companyQb.getMany();

    // Fetch product items for each company
    const companyIds = companies.map((c) => c.id);
    if (companyIds.length > 0) {
      const piQb = piRepo
        .createQueryBuilder("pi")
        .leftJoinAndSelect("pi.image", "image")
        .leftJoinAndSelect("pi.images", "images")
        .leftJoinAndSelect("pi.productCategory", "category")
        .leftJoinAndSelect("category.product", "product")
        .where("pi.companyId IN (:...companyIds)", { companyIds })
        .andWhere("pi.deletedAt IS NULL");

      if (productId) {
        piQb.andWhere("category.productId = :productId", { productId: Number(productId) });
      }

      const productItems = await piQb.getMany();

      // Group by company
      const itemsByCompany = new Map<number, any[]>();
      for (const pi of productItems) {
        const cId = pi.companyId;
        if (!itemsByCompany.has(cId)) itemsByCompany.set(cId, []);
        itemsByCompany.get(cId)!.push(pi);
      }

      // Attach to companies
      const result = companies.map((c) => ({
        ...c,
        productItems: itemsByCompany.get(c.id) || [],
      }));

      // If productId filter, only return companies that have matching items
      if (productId) {
        return Response.json(result.filter(c => (c as any).productItems.length > 0));
      }
      return Response.json(result);
    }

    // No companies, return empty or with empty productItems
    return Response.json(companies.map(c => ({ ...c, productItems: [] })));
  } catch (error) {
    console.error("Companies GET error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

// POST /api/companies (protected)
export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  const authErr = requireAuth(user);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const db = await getDb();
    const companyRepo = db.getRepository(CompanyEntity);

    const company = companyRepo.create({
      name: body.name,
      fileId: body.fileId,
      secondaryFileId: body.secondaryFileId,
      activeFileId: body.activeFileId,
    });

    const saved = await companyRepo.save(company);
    return Response.json(saved, { status: 201 });
  } catch (error) {
    console.error("Company create error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
