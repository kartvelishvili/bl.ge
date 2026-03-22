import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { FileEntity } from "./file.entity";

@Entity("management_team")
export class ManagementTeamEntity extends BaseEntity {
  @Column({ name: "first_name", type: "json" })
  firstName!: { en: string; ru: string; ge: string };

  @Column({ name: "last_name", type: "json" })
  lastName!: { en: string; ru: string; ge: string };

  @Column({ name: "image_id" })
  imageId!: number;

  @ManyToOne(() => FileEntity, { eager: true })
  @JoinColumn({ name: "image_id" })
  image!: FileEntity;

  @Column({ type: "json" })
  profession!: { en: string; ru: string; ge: string };

  @Column({ name: "sort_order", type: "int", default: 0 })
  sortOrder!: number;
}
