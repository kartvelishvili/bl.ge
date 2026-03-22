import { Entity, Column } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity("contact_us")
export class ContactUsEntity extends BaseEntity {
  @Column({ name: "first_name" })
  firstName!: string;

  @Column({ name: "last_name" })
  lastName!: string;

  @Column({ name: "phone_number" })
  phoneNumber!: string;

  @Column()
  email!: string;

  @Column({ type: "longtext" })
  text!: string;

  @Column({ name: "is_read", type: "tinyint", default: 0 })
  isRead!: boolean;
}
