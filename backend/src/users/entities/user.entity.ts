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
  avatar: string;

  @Column()
  status: string;

  @Column()
  rating: number;

  @Column()
  backgroundColor: string;

  @Column("text", {array: true, nullable: true}) 
  friends: string[];
}
