// import { Socket } from "socket.io";

import { Socket } from "socket.io";
import { User } from "src/users/entities/user.entity";

export const STATUS_ONLINE = 'online';
export const STATUS_PLAYING = 'playing';
export const STATUS_OFFLINE = 'offline';
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

  private _user: User;
  private _socket: Socket | null;

  private constructor(user: User, socket: Socket | null) {
    this._user = user;
    this._socket = socket;
  }

  public get user(): User { return this._user; }
  public get socket(): Socket | null { return this._socket; }

  public set user(user: User) { this._user = user; }
  public set socket(socket: Socket | null) { this._socket = socket; }

  public static new(user: User, clientSocket: Socket | null): Client {
    const client = new Client(user, clientSocket);
    Client.__clients_.add(client);
    return client;
  }

  public static at(id: number): Client | null;
  public static at(username: string): Client | null;
  public static at(clientSocket: Socket): Client | null;
  public static at(client: number | string | Socket): Client | null {
    if (typeof client === 'number') {
      for (const clt of Client.__clients_.values()) {
        if (clt._user.id === client) {
          return clt;
        }
      }
    }
    else if (typeof client === 'string') {
      for (const clt of Client.__clients_.values()) {
        if (clt._user.username.toLowerCase() === client.toLowerCase()) {
          return clt;
        }
      }
    }
    else {
      for (const clt of Client.__clients_.values()) {
        if (clt._socket && clt._socket.id === client.id) {
          return clt;
        }
      }
    }
    return null;
  }

  public static list() {
    return Array.from(Client.__clients_);
  }

  public static delete(socket: Socket) {
    for (const clt of Client.__clients_.values()) {
      if (clt._socket && clt._socket.id === socket.id) {
        Client.__clients_.delete(clt);
        return;
      }
    }
  }
}

export default Client;
