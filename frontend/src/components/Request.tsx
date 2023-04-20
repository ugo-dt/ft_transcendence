import axios from "axios";
import { IUser, IRoom } from "../types";

namespace __url_ {
  export const __users_base_ = 'users/';
  export const __game_base_ = 'pong/';
  export const __chat_base_ = 'chat/';

  // Users
  export const __edit_username_ = __users_base_ + 'edit/username/';
  export const __valid_username_ = __users_base_ + 'edit/is-valid-username/';
  export const __add_friend_ = __users_base_ + 'add-friend/'
  export const __remove_friend_ = __users_base_ + 'remove-friend/'

  // Game
  export const __rankings_ = __game_base_ + 'rankings/';
  export const __rooms_ = __game_base_ + 'rooms/';
  export const __history_ = __users_base_ + 'history/';

  // Chat
  export const __channels_ = __chat_base_ + 'channels/'
  export const __channel_ = __chat_base_ + 'channels/'
}

class Request {
  private static __axios_ = axios.create({
    baseURL: "http://localhost:3000/api/",
    withCredentials: true,
  })

  private static async __make_get_request_<T>(url: string): Promise<T | null> {
    return await Request.__axios_.get(
      url,
      {
        withCredentials: true,
      }
    ).then(res => {
      return res.data;
    }).catch(() => {
      return null;
    });
  }

  private static async __make_array_get_request_<T>(url: string): Promise<T[]> {
    const data: T[] | null = await Request.__make_get_request_(url);
    return data ? data : [];
  }

  private static async __make_post_request_<T>(url: string): Promise<T | null> {
    return await Request.__axios_.post(
      url,
      {
        withCredentials: true,
      }
    ).then(res => {
      return res.data;
    }).catch(() => {
      return null;
    });
  }

  private static async __make_delete_request_<T>(url: string): Promise<T | null> {
    return await Request.__axios_.delete(
      url,
      {
        withCredentials: true,
      }
    ).then(res => {
      return res.data;
    }).catch(() => {
      return null;
    });
  }

  public static async getProfile(username: string): Promise<IUser | null> {
    return await Request.__make_get_request_(__url_.__users_base_ + username);
  }

  public static async getUserMatchHistory(username: string): Promise<IRoom[]> {
    return this.__make_array_get_request_(__url_.__history_ + username);
  }

  public static async getRankings(): Promise<IUser[]> {
    return this.__make_array_get_request_(__url_.__rankings_);
  }

  public static async getRoomList(): Promise<IRoom[]> {
    return this.__make_array_get_request_(__url_.__rooms_);
  }

  public static async addFriend(username: string, friendUsername: string) {
    return await Request.__make_post_request_(__url_.__add_friend_ + '?username=' + username + '&friendName=' + friendUsername);
  }

  public static async removeFriend(username: string, friendUsername: string) {
    return await Request.__make_delete_request_(__url_.__remove_friend_ + '?username=' + username + '&friendName=' + friendUsername);
  }

  public static async editUsername(newUsername: string): Promise<IUser | null> {
    return await Request.__make_post_request_(__url_.__edit_username_ + newUsername);
  }

  public static async isValidUsername(newUsername: string): Promise<string | null> {
    return await Request.__make_get_request_(__url_.__valid_username_ + '?username=' + newUsername);
  }
}

export default Request;