import { Socket } from "socket.io";

export const STATUS_ONLINE = 0x1;
export const STATUS_PLAYING = 0x2;
export const STATUS_OFFLINE = 0x4;
export type _Status = typeof STATUS_ONLINE | typeof STATUS_PLAYING | typeof STATUS_OFFLINE;

class Client {
  private static __clients_ = new Set<Client>;

  private __socket_: Socket;
  private _id: number;
  private _name: string;
  private _avatar: string | null;
  private _backgroundColor: string;
  private _status: _Status;
  private _rating: number;

  private __newId(): number {
    let _new_id = 0;
    for (const client of Client.__clients_.values()) {
      if (client._id != _new_id && !(Client.at(_new_id))) {
        break ;
      }
      _new_id++;
    }    
    return _new_id;
  }

  private constructor(socket: Socket) {
    this.__socket_ = socket;
    this._id = this.__newId();
    this._name = socket.data.name || 'User' + this._id;
    this._avatar = socket.data.avatar;
    this._backgroundColor = socket.data.backgroundColor;
    this._status = STATUS_ONLINE;
    this._rating = 1200;
  }

  public get __socket(): Socket { return this.__socket_; }
  public get id(): number { return this._id; }
  public get name(): string { return this._name; }
  public get avatar(): string | null { return this._avatar; }
  public get backgroundColor(): string { return this._backgroundColor; }
  public get status(): typeof STATUS_ONLINE | typeof STATUS_PLAYING | typeof STATUS_OFFLINE { return this._status; }
  public get rating(): number { return this._rating; }

  public set __socket(__socket_: Socket) { this.__socket_ = __socket_; }
  public set id(id: number) { this._id = id; }
  public set name(name: string) { this._name = name; }
  public set avatar(avatar: string | null) { this._avatar = avatar; }
  public set backgroundColor(backgroundColor: string) { this._backgroundColor = backgroundColor; }
  public set status(status: _Status ) { this._status = status; }
  public set rating(rating: number) { this._rating = rating; }

  public static new(clientSocket: Socket): Client {
    const client = new Client(clientSocket);
    Client.__clients_.add(client);
    return client;
  }

  public static at(clientId: number): Client | undefined;
  public static at(clientSocket: Socket): Client | undefined;
  public static at(client: number | Socket): Client | undefined {
    // Client ID
    if (typeof client === 'number') {
      for (const clt of Client.__clients_.values()) {
        if (clt._id === client) {
          return clt;
        }
      }
    }
    
    // Socket
    else {
      for (const clt of Client.__clients_.values()) {
        if (clt.__socket_.id === client.id) {
          return clt;
        }
      }
    }
    return undefined;
  }

  public static remove(socket: Socket) {
    for (const client of Client.__clients_.values()) {
      if (client.__socket_.id === socket.id) {
        Client.__clients_.delete(client);
      }
    }
  }

  public static list() {
    return Array.from(Client.__clients_);
  }
}

export default Client;