import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { ProductEntity } from "./product.entity";

@Entity("product_category")
export class ProductCategoryEntity extends BaseEntity {
  @Column("json")
  name!: { en: string; ru: string; ge: string };

  @Column({ name: "product_id" })
  productId!: number;

  @ManyToOne(() => ProductEntity, { eager: true })
  @JoinColumn({ name: "product_id" })
  product!: ProductEntity;
}
