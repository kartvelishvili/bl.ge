import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { FileEntity } from "./file.entity";
import { ProductCategoryEntity } from "./product-category.entity";
import { CompanyEntity } from "./company.entity";
import { FoodEntity } from "./food.entity";

export enum GlassType {
  WINE = "wine",
  BURGUNDY = "burgundy",
  CORDIAL = "cordial",
  CHAMPAGNE = "champagne",
  COGNAC = "cognac",
}

@Entity("product_item")
export class ProductItemEntity extends BaseEntity {
  @Column("json")
  name!: { en: string; ge: string; ru: string };

  @Column({ name: "image_id" })
  imageId!: number;

  @ManyToOne(() => FileEntity, { eager: true })
  @JoinColumn({ name: "image_id" })
  image!: FileEntity;

  @Column("json")
  description!: { en: string; ge: string; ru: string };

  @Column({ type: "float" })
  alcohol!: number;

  @Column()
  temperature!: string;

  @Column("json")
  color!: { en: string; ge: string; ru: string };

  @Column({ name: "vinification_id", nullable: true })
  vinificationId!: number;

  @ManyToOne(() => FileEntity, { eager: true, nullable: true })
  @JoinColumn({ name: "vinification_id" })
  vinification!: FileEntity;

  @Column({ name: "fruit_tones", type: "float" })
  fruitTones!: number;

  @Column({ type: "float" })
  tannins!: number;

  @Column({ type: "float" })
  sweetness!: number;

  @Column({ type: "float" })
  body!: number;

  @Column({ type: "enum", enum: GlassType })
  glass!: GlassType;

  @Column({ name: "product_category_id" })
  productCategoryId!: number;

  @ManyToOne(() => ProductCategoryEntity, { eager: true })
  @JoinColumn({ name: "product_category_id" })
  productCategory!: ProductCategoryEntity;

  @Column({ name: "company_id" })
  companyId!: number;

  @ManyToOne(() => CompanyEntity)
  @JoinColumn({ name: "company_id" })
  company!: CompanyEntity;

  @Column({ name: "is_popular", default: false })
  isPopular!: boolean;

  @Column({ type: "json", nullable: true })
  composition!: { en: string; ge: string; ru: string } | null;

  @Column({ type: "json", nullable: true })
  viticulture!: { en: string; ge: string; ru: string } | null;

  @Column({ type: "json", nullable: true })
  aged!: { en: string; ge: string; ru: string } | null;

  @Column({ type: "json", nullable: true })
  volume!: { en: string; ge: string; ru: string } | null;

  @ManyToMany(() => FoodEntity)
  @JoinTable({
    name: "food_items_product_item",
    joinColumn: { name: "productItemId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "foodId", referencedColumnName: "id" },
  })
  foods!: FoodEntity[];

  @ManyToMany(() => FileEntity)
  @JoinTable({
    name: "product_items_awards",
    joinColumn: { name: "product_item_id" },
    inverseJoinColumn: { name: "file_id" },
  })
  awards!: FileEntity[];

  @ManyToMany(() => FileEntity)
  @JoinTable({
    name: "product_items_images",
    joinColumn: { name: "product_item_id" },
    inverseJoinColumn: { name: "file_id" },
  })
  images!: FileEntity[];
}
