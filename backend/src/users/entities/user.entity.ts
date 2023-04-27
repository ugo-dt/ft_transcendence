import { Exclude } from "class-transformer";
import { Channel } from "src/chat/channel/entities/channel.entity";
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
  paddleColor: string;

  @Column("text", {array: true, nullable: true}) 
  friends: string[];

  @Column("text", {array: true, nullable: true}) 
  blocked: string[]; // usernames

  @Column("int", {array: true, nullable: true}) 
  userChannels: number[]; // channel ids
}
