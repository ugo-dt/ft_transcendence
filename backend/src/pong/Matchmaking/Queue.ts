import { Server } from "socket.io";
import Client from "../Client/Client";
import { PongService } from "../pong.service";
import Elo from "./Elo";

namespace Queue {
  const __date_ = new Date();
  const __queue_ = new Map<Client, number>;

  export function add(client: Client) {
    __queue_.set(client, __date_.getTime());
  }

  export function has(client: Client) {
    return __queue_.has(client);
  }

  export function remove(client: Client): void;
  export function remove(clientId: number): void;
  export function remove(client: Client | number): void {
    if (typeof client === 'number') {
      const clt = Client.at(client);
      if (clt) {
        __queue_.delete(clt);
      }
    }
    else {
      __queue_.delete(client);
    }
  }

  export function size(): number {
    return __queue_.size;
  }

  export function list(): Client[] {
    return Array.from(__queue_.keys());
  }

  function _findBestMatch(player: Client, joinTime: number): Client | null {
    const timeInQueue = (new Date().getTime() - joinTime) / 1000;
    const maxEloDiff = Elo.kFactor * Math.max(1, timeInQueue);

    const eligiblePlayers = Array.from<Client>(__queue_.keys()).filter(
      p => p.user.id !== player.user.id && Math.abs(player.user.rating - p.user.rating) <= maxEloDiff
    );

    if (eligiblePlayers.length > 0) {
      eligiblePlayers.sort((a, b) => Math.abs(player.user.rating - a.user.rating) - Math.abs(player.user.rating - b.user.rating));
      return eligiblePlayers[0];
    }

    return null;
  }

  export function tryMatchPlayers(server: Server, pongService: PongService): void {
    //todo: revert this after tests
    const player1 = Array.from<Client>(__queue_.keys())[0];
    const player2 = player1;
    // const joinTime1 = __queue_.get(player1)!;
    // const player2 = _findBestMatch(player1, joinTime1);

    if (player2) {
      pongService.startGame(server, player1, player2);
    }
  }
}

export default Queue;