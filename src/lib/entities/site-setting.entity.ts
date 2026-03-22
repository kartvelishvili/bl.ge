import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("site_settings")
export class SiteSettingEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "setting_key", type: "varchar", length: 255, unique: true })
  key!: string;

  @Column({ name: "setting_value", type: "text" })
  value!: string;
}
