import { Entity, Column } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity("user")
export class UserEntity extends BaseEntity {
  @Column({ name: "user_name" })
  userName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;
}
