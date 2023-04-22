import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { GameState } from 'src/pong/Game';
import { User } from 'src/users/entities/user.entity';
import { IGameRoom } from './GameRoom';

@Injectable()
export class RoomService {
  private readonly logger: Logger;
  constructor(@InjectRepository(Room) private repo: Repository<Room>) {
    this.logger = new Logger("RoomService");
  }

  async create(left: User, right: User, gameState: GameState) {
    const room = this.repo.create(
      {
        left: left,
        right: right,
        gameState: gameState,
      }
    );
    const promise = await this.repo.save(room);
    this.logger.log(`Saved game ${promise.id} (${promise.left.username} VS ${promise.right.username})`);
    return promise;
  }

  IGameRoom(room: Room): IGameRoom {
    const iGameRoom: IGameRoom = {
      id: room.id,
      left: room.left,
      right: room.right,
      gameState: room.gameState,
    };
    return iGameRoom;
  }

  findOneId(id: number): Promise<Room | null> {
    return this.repo.findOneBy({ id });
  }
  
  findAll(): Promise<Room[]> {
    return this.repo.find();
  }

  async update(id: number, attrs: Partial<Room>): Promise<Room> {
    const room = await this.findOneId(id);
    if (!room) {
      throw new NotFoundException("room not found");
    }
    Object.assign(room, attrs);
    return this.repo.save(room);
  }

  async findAllWithUser(user: User) {
    const history: Room[] = [];
    const rooms: Room[] = await this.findAll();

    for (const room of rooms.values()) {
      if (!room.left || !room.right) {
        continue ;
      }
      if (room.left.id === user.id || room.right.id === user.id) {
        history.unshift(room);
      }
    }
    return history;
  }
}
