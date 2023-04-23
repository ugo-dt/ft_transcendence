import { IGameState } from "src/pong/Game";
import { User } from "src/users/entities/user.entity";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  left: number;

  @Column()
  right: number;
  
  @Column("jsonb")
  gameState: IGameState;
}
