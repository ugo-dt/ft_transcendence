import { Socket } from "socket.io";
import { Channel } from "src/chat/channel/entities/channel.entity";
import { GAMETYPE_CASUAL, GAMETYPE_RANKED, GameType } from "src/room/GameRoom";

interface Challenge {
  socketId: string,
  opponentUserId: number,
  type: GameType,
}

class Client {
  private static __clients_ = new Set<Client>;

  private readonly _id: number;
  private _sockets: Socket[];

  // Pong
  private _challenges: Challenge[]; // challenger socket id, opponent user id
  private _invitations: number[];
  private _wantsRematch: boolean;

  // Chat
  private _userChannels: number[]; // channel ids

  private constructor(id: number, socket: Socket | null) {
    this._id = id;
    this._sockets = [];
    if (socket) {
      this._sockets.push(socket);
    }
    this._challenges = [];
    this._invitations = [];
    this._wantsRematch = false;
    this._userChannels = [];
  }

  public get id(): number { return this._id; }
  public get sockets(): Socket[] { return this._sockets; }
  public get invitations(): number[] { return this._invitations; }
  public get wantsRematch(): boolean { return this._wantsRematch; }

  public set sockets(sockets: Socket[]) { this._sockets = sockets; }
  public set invitations(invitations: number[]) { this._invitations = invitations; }
  public set wantsRematch(wantsRematch: boolean) { this._wantsRematch = wantsRematch; }

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

  public createChallenge(socketId: string, opponentId: number, isRanked: boolean) {
    this._challenges.push(
      {
        socketId: socketId,
        opponentUserId: opponentId,
        type: isRanked ? GAMETYPE_RANKED : GAMETYPE_CASUAL,
      }
    );
  }

  public cancelChallenge(socketId: string) {
    const index = this._challenges.findIndex(c => c.socketId === socketId);
    if (index > -1) {
      this._challenges.splice(index, 1);
    }
  }

  public getChallengeOpponent(socketId: string): number | undefined {
    return this._challenges.find(c => c.socketId === socketId)?.opponentUserId;
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

  public addChannel(channel: Channel) {
    if (!this._userChannels.includes(channel.id)) {
		  this._userChannels.push(channel.id);
    }
    for (const s of this._sockets.values()) {
      s.emit('chat-update', channel);
    }
  }

  public removeChannel(id: number) {
    const index = this._userChannels.indexOf(id);
    if (index > -1) {
      this._userChannels.splice(index, 1);
    }
  }

  public leaveChannelRoom(channel: Channel) {
    for (const s of this._sockets.values()) {
      s.emit('leave-channel', channel);
      s.leave(channel.room);
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
