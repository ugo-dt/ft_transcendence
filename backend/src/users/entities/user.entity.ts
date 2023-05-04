import { Exclude } from "class-transformer";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Exclude()
  accessToken: string;

  @Column()
  @Exclude()
  refreshToken: string;

  @Column()
  id42: number;

  @Column()
  username: string;

  @Column()
  has2fa: boolean;

  @Column()
  phoneNumber: string;

  @Column()
  avatar: string;

  @Column()
  status: string;

  @Column()
  rating: number;

  @Column()
  paddleColor: string;

  @Column("int", {array: true, nullable: true}) 
  friends: number[];

  @Column("int", {array: true, nullable: true}) 
  blocked: number[];
}
