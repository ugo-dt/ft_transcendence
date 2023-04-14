import Room, { IRoom } from "./Room";

namespace RoomHistory {
  /** This set contains all the played rooms */
  const __history_ = new Set<IRoom>;

  export function add(room: Room) {
    __history_.add(room.IRoom());
  }

  export function remove(room: Room) {
    __history_.delete(room.IRoom());
  }

  export function list(): IRoom[] {
    return Array.from(__history_);
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