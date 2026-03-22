import { Entity, Column, ManyToOne, ManyToMany, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { FileEntity } from "./file.entity";

@Entity("food")
export class FoodEntity extends BaseEntity {
  @Column("json")
  name!: { en: string; ge: string; ru: string };

  @Column({ name: "image_id" })
  imageId!: number;

  @ManyToOne(() => FileEntity, { eager: true })
  @JoinColumn({ name: "image_id" })
  image!: FileEntity;
}
