import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { FileEntity } from "./file.entity";

@Entity("product")
export class ProductEntity extends BaseEntity {
  @Column("json")
  name!: { en: string; ge: string; ru: string };

  @Column({ name: "image_id" })
  imageId!: number;

  @ManyToOne(() => FileEntity, { eager: true })
  @JoinColumn({ name: "image_id" })
  file!: FileEntity;

  @Column({ name: "sort_order", type: "int", default: 0 })
  sortOrder!: number;
}
