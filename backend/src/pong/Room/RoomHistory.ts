import Client from "../Client/Client";
import Room, { IRoom } from "./Room";

namespace RoomHistory {
  /** This set contains all the played rooms */
  const __history_: IRoom[] = [];

  export function add(room: Room) {
    __history_.unshift(room.IRoom());
  }

  export function remove(room: Room) {
    const index = __history_.indexOf(room.IRoom());
    if (index > -1) { // only splice array when item is found
      __history_.splice(index, 1); // 2nd parameter means remove one item only
    }
  }

  export function userHistory(client: Client): IRoom[] {
    const history: IRoom[] = [];

    for (const room of __history_.values()) {
      if (!room.left || !room.right) {
        continue ;
      }
      if (room.left.id === client.user.id || room.right.id === client.user.id) {
        history.push(room);
      }
    }
    return history;
  }

  export function list(): IRoom[] {
    return __history_;
  }

  export function at(roomId: number): IRoom | null;
  export function at(roomId: string): IRoom | null;
  export function at(room: Room): IRoom | null;
  export function at(x: number | Room | string): IRoom | null {
    // Room ID
    if (typeof x === 'number') {
      for (const room of __history_.values()) {
        if (room.id === x) {
          return room;
        }
      }
    }
    else if (typeof x === 'string') {
      for (const room of __history_.values()) {
        if (room.id.toString() == x) {
          return room;
        }
      }
    }

    // Room
    else {
      for (const room of __history_.values()) {
        if (room.id === x.id) {
          return room;
        }
      }
    }
    return null;
  }
}

export default RoomHistory