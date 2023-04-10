import Client from "../Client/Client";

namespace Queue {
  const __queue_ = new Set<Client>;

  export function add(client: Client) {
    __queue_.add(client);
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
    return Array.from(__queue_);
  }
}

export default Queue;