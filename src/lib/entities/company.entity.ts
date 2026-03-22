import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { FileEntity } from "./file.entity";

@Entity("company")
export class CompanyEntity extends BaseEntity {
  @Column()
  name!: string;

  @Column({ name: "file_id" })
  fileId!: number;

  @ManyToOne(() => FileEntity, { eager: true })
  @JoinColumn({ name: "file_id" })
  file!: FileEntity;

  @Column({ name: "secondary_file_id", nullable: true })
  secondaryFileId!: number;

  @ManyToOne(() => FileEntity, { eager: true, nullable: true })
  @JoinColumn({ name: "secondary_file_id" })
  secondaryFile!: FileEntity;

  @Column({ name: "active_file_id", nullable: true })
  activeFileId!: number;

  @ManyToOne(() => FileEntity, { eager: true, nullable: true })
  @JoinColumn({ name: "active_file_id" })
  activeFile!: FileEntity;
}
