import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  content: string;

  @Column()
  timestamp: string;

  @Column()
  senderId: number;

  @Column()
  destination: number;
}
