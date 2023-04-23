// import { Socket } from "socket.io";

import { Socket } from "socket.io";
import { UsersService } from "src/users/users.service";


// export type _Status = typeof STATUS_ONLINE | typeof STATUS_PLAYING | typeof STATUS_OFFLINE;

// export interface IClient {
//   id: number,
// }

// class Client {
//   private static __clients_ = new Set<Client>;

//   private __socket_: Socket;
//   private _id: number;

//   private __newId(): number {
//     let _new_id = 0;
//     while (Client.at(_new_id)) {
//       _new_id++;
//     }
//     return _new_id;
//   }

//   private constructor(socket: Socket) {
//     this.__socket_ = socket;
//     this._id = parseInt(socket.handshake.query.id as string);
//   }

//   public get __socket(): Socket { return this.__socket_; }
//   public get id(): number { return this._id; }

//   public set __socket(__socket_: Socket) { this.__socket_ = __socket_; }
//   public set id(id: number) { this._id = id; }

//   public IClient(): IClient {
//     const iClient: IClient = {
//       id: this._id,
//     }
//     return iClient;
//   }

//   public static new(clientSocket: Socket): Client {
//     const client = new Client(clientSocket);
//     Client.__clients_.add(client);
//     return client;
//   }

//   public static at(username: string): Client | null;
//   public static at(id: number): Client | null;
//   public static at(clientSocket: Socket): Client | null;
//   public static at(client: number | Socket | string): Client | null {
//     // Client ID
//     if (typeof client === 'number') {
//       for (const clt of Client.__clients_.values()) {
//         if (clt._id === client) {
//           return clt;
//         }
//       }
//     }

//     else if (typeof client === 'string') {
//       if (!client) {
//         return null;
//       }
//       for (const clt of Client.__clients_.values()) {
//         if (clt._username.toLowerCase() === client.toLowerCase()) {
//           return clt;
//         }
//       }
//     }

//     // Socket
//     else {
//       if (!client) {
//         return null;
//       }
//       for (const clt of Client.__clients_.values()) {
//         if (clt.__socket_.id === client.id) {
//           return clt;
//         }
//       }
//     }
//     return null;
//   }

//   public static delete(socket: Socket) {
//     for (const client of Client.__clients_.values()) {
//       if (client.__socket_.id === socket.id) {
//         Client.__clients_.delete(client);
//         return ;
//       }
//     }
//   }

//   public static list() {
//     const clientList: IClient[] = [];

//     Client.__clients_.forEach((client: Client) => {
//       clientList.push(client.IClient());
//     });
//     return clientList;
//   }
// }

// export default Client;

class Client {
  private static __clients_ = new Set<Client>;

  private _id: number;
  private _sockets: Socket[];
  private _challenges: Map<string, number>; // user socket id, opponent id
  private _invitations: number[];

  private constructor(id: number, socket: Socket | null) {
    this._id = id;
    this._sockets = [];
    if (socket) {
      this._sockets.push(socket);
    }
    this._challenges = new Map();
    this._invitations = [];
  }

  public get id(): number { return this._id; }
  public get sockets(): Socket[] { return this._sockets; }
  public get invitations(): number[] { return this._invitations; }
  
  public set id(id: number) { this._id = id; }
  public set sockets(sockets: Socket[]) { this._sockets = sockets; }
  public set invitations(invitations: number[]) { this._invitations = invitations; }

  public addSocket(socket: Socket) {
    if (!this._sockets.includes(socket)) {
      this.sockets.push(socket);
    }
  }

  public removeSocket(socket: Socket) {
    const index = this._sockets.indexOf(socket);
    if (index > -1) {
      this._sockets.splice(index, 1);
    }
  }

  public ownsSocket(socket: Socket): boolean {
    for (const s of this._sockets.values()) {
      if (s.id === socket.id) {
        return true;
      }
    }
    return false;
  }

  public joinRoom(roomId: number) {
    for (const s of this._sockets.values()) {
      s.join(roomId.toString());
    }
  }

  public leaveRoom(roomId: number) {
    for (const s of this._sockets.values()) {
      s.leave(roomId.toString());
    }
  }

  public createChallenge(socketId: string, opponentId: number) {
    this._challenges.set(socketId, opponentId);
  }

  public cancelChallenge(socketId: string) {
    this._challenges.delete(socketId);
  }

  public getChallengeOpponent(socketId: string): number | undefined {
    return this._challenges.get(socketId);
  }

  public hasChallenge(socketId: string) {
    return (this.getChallengeOpponent(socketId) != undefined);
  }

  public addInvitation(id: number) {
    if (!this._invitations.includes(id)) {
      this._invitations.push(id);
    }
  }

  public hasInvitation(id: number) {
    return this._invitations.includes(id);
  }

  public removeInvitation(id: number) {
    const index = this._invitations.indexOf(id);
    if (index > -1) {
      this._invitations.splice(index, 1);
    }
  }

  public static new(id: number, clientSocket: Socket | null): Client {
    const client = new Client(id, clientSocket);
    Client.__clients_.add(client);
    return client;
  }

  public static at(id: number): Client | null;
  public static at(clientSocket: Socket): Client | null;
  public static at(client: number | Socket): Client | null {
    if (typeof client === 'number') {
      for (const clt of Client.__clients_.values()) {
        if (clt._id === client) {
          return clt;
        }
      }
    }
    else {
      for (const clt of Client.__clients_.values()) {
        if (clt._sockets.includes(client)) {
          return clt;
        }
      }
    }
    return null;
  }

  public static list(): Client[] {
    return Array.from(Client.__clients_);
  }

  public static delete(id: number): void;
  public static delete(socket: Socket): void;
  public static delete(client: number | Socket): void {
    if (typeof client === 'number') {
      for (const clt of Client.__clients_.values()) {
        if (clt._id === client) {
          Client.__clients_.delete(clt);
          return;
        }
      }
    }
    else {
      for (const clt of Client.__clients_.values()) {
        if (clt._sockets.includes(client)) {
          Client.__clients_.delete(clt);
          return;
        }
      }
    }
  }
}

export default Client;
