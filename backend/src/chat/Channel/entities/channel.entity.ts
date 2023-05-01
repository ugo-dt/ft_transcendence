import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({nullable: true})
  password: string;

  @Column()
  isDm: boolean;

  @Column("int", {array: true, nullable: true}) 
  messages: number[];

  @Column("int", {array: true, nullable: true}) 
  users: number[];

  @Column("int", {array: true, nullable: true}) 
  admins: number[];
  
  @Column("int", {array: true, nullable: true}) 
  muted: number[];

  @Column("int", {array: true, nullable: true}) 
  banned: number[];

  @Column()
  room: string; // socket room

  @Column()
  isPrivate: boolean;
}
