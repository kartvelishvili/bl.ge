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

export enum BlogTypeEnum {
  ABOUT_US = "about-us",
  NORMAL = "normal",
}

@Entity("blog")
export class BlogEntity extends BaseEntity {
  @Column("json")
  title!: { en: string; ge: string; ru: string };

  @Column("json")
  description!: { en: string; ge: string; ru: string };

  @Column({ name: "file_id" })
  fileId!: number;

  @ManyToOne(() => FileEntity, { eager: true })
  @JoinColumn({ name: "file_id" })
  file!: FileEntity;

  @Column({ type: "enum", enum: BlogTypeEnum, default: BlogTypeEnum.NORMAL })
  type!: BlogTypeEnum;

  @ManyToMany(() => FileEntity)
  @JoinTable({
    name: "blog_files",
    joinColumn: { name: "blog_id" },
    inverseJoinColumn: { name: "file_id" },
  })
  gallery!: FileEntity[];

  @Column({ name: "visible_on_home", default: false })
  visibleOnHome!: boolean;

  @Column({ name: "sort_order", type: "int", default: 0 })
  sortOrder!: number;
}
