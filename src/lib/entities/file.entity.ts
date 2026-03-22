import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";

@Entity("file")
export class FileEntity extends BaseEntity {
  @Column()
  url!: string;

  @Column({ name: "user_id", nullable: true })
  userId!: number;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;
}
