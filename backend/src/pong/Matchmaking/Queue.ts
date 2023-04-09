import Client from "../Client/Client";

class Queue {
  private static __queue_ = new Set<Client>;

  public static add(client: Client) {
    this.__queue_.add(client);
  }

  public static remove(client: Client): void;
  public static remove(clientId: number): void;
  public static remove(client: Client | number): void {
    if (typeof client === 'number') {
      const clt = Client.at(client);
      if (clt) {
        this.__queue_.delete(clt);
      }
    }
    else {
      this.__queue_.delete(client);
    }
  }

  public static size(): number {
    return Queue.__queue_.size;
  }

  public static list(): Client[] {
    return Array.from(Queue.__queue_);
  }
}

export default Queue;