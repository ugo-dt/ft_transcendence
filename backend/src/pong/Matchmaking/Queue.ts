import { Server } from "socket.io";
import Client from "../Client/Client";
import { PongService } from "../pong.service";
import Elo from "./Elo";
import { UsersService } from "src/users/users.service";
import { GAMETYPE_RANKED } from "src/room/GameRoom";

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

  async function _findBestMatch(usersService: UsersService, player: Client, joinTime: number): Promise<Client | null> {
    const timeInQueue = (new Date().getTime() - joinTime) / 1000;
    const maxEloDiff = Elo.kFactor * Math.max(1, timeInQueue);
    const playerRating = await usersService.getRating(player.id);

    const eligiblePlayers = Array.from<Client>(__queue_.keys()).filter(async (p) => {
      p.id !== player.id && Math.abs(playerRating - await usersService.getRating(p.id)) <= maxEloDiff
    });

    if (eligiblePlayers.length > 0) {
      //   eligiblePlayers.sort((a, b) => {
      //     Math.abs(playerRating - a.rating) - Math.abs(playerRating - b.rating)
      //   });
      //   return eligiblePlayers[0];
      let closest = eligiblePlayers[0];
      let closestRating = await usersService.getRating(closest.id);
      const playerRating = await usersService.getRating(player.id);
      for (const p of eligiblePlayers) {
        const pRating = await usersService.getRating(p.id);
        if (Math.abs(playerRating - pRating) < Math.abs(playerRating - closestRating)) {
          closest = p;
          closestRating = pRating;
        }
      }
      return closest;
    }
    return null;
  }

  export async function tryMatchPlayers(server: Server, pongService: PongService) {
    //todo: revert this after tests
    const player1 = Array.from<Client>(__queue_.keys())[0];
    const player2 = player1;
    // const joinTime1 = __queue_.get(player1)!;
    // const player2 = await _findBestMatch(this.pongService.getusersService(), player1, joinTime1);

    if (player2) {
      pongService.startGame(server, player1, player2, GAMETYPE_RANKED);
    }
  }
}

export default Queue;