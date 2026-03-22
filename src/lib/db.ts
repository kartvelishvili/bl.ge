import "reflect-metadata";
import { DataSource } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import { FileEntity } from "./entities/file.entity";
import { BlogEntity } from "./entities/blog.entity";
import { ContactUsEntity } from "./entities/contact-us.entity";
import { CompanyEntity } from "./entities/company.entity";
import { FoodEntity } from "./entities/food.entity";
import { ManagementTeamEntity } from "./entities/management-team.entity";
import { ProductEntity } from "./entities/product.entity";
import { ProductCategoryEntity } from "./entities/product-category.entity";
import { ProductItemEntity } from "./entities/product-item.entity";

const entities = [
  UserEntity,
  FileEntity,
  BlogEntity,
  ContactUsEntity,
  CompanyEntity,
  FoodEntity,
  ManagementTeamEntity,
  ProductEntity,
  ProductCategoryEntity,
  ProductItemEntity,
];

const globalForDb = globalThis as unknown as {
  dataSource: DataSource | undefined;
  dsInitPromise: Promise<DataSource> | undefined;
};

function isDataSourceStale(ds: DataSource): boolean {
  try {
    for (const entity of entities) {
      ds.getMetadata(entity);
    }
    return false;
  } catch {
    return true;
  }
}

export async function getDb(): Promise<DataSource> {
  // Return cached DataSource if valid and not stale (handles hot-reload)
  if (globalForDb.dataSource?.isInitialized && !isDataSourceStale(globalForDb.dataSource)) {
    return globalForDb.dataSource;
  }

  // Avoid concurrent initialization
  if (globalForDb.dsInitPromise) {
    return globalForDb.dsInitPromise;
  }

  globalForDb.dsInitPromise = (async () => {
    // Destroy stale DataSource
    if (globalForDb.dataSource?.isInitialized) {
      try { await globalForDb.dataSource.destroy(); } catch {}
    }
    globalForDb.dataSource = undefined;

    const ds = new DataSource({
      type: "mysql",
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT) || 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      charset: "utf8mb4",
      synchronize: false,
      entities,
    });

    await ds.initialize();
    globalForDb.dataSource = ds;
    globalForDb.dsInitPromise = undefined;
    return ds;
  })();

  return globalForDb.dsInitPromise;
}
