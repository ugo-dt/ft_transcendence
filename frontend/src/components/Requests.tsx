import axios from "axios";
import { IUser, IRoom } from "../types";

namespace Requests {
  const __requests_url_base_  = "http://localhost:3000/api/"

  const __url_users_base_     = __requests_url_base_ + 'users/';
  const __url_edit_username_  = __url_users_base_ + 'edit-username/';
  const __url_valid_username_ = __url_users_base_ + 'edit/is-valid-username/';
  const __url_add_friend_     = __url_users_base_ + 'add-friend/'
  const __url_remove_friend_  = __url_users_base_ + 'remove-friend/'
  const __url_friends_        = __url_users_base_ + 'friends/';
  const __url_rankings_       = __url_users_base_ + 'rankings/';
  
  const __url_game_base       = __requests_url_base_ + 'pong/';
  const __url_history_        = __url_users_base_ + 'history/';
  const __url_rooms_          = __url_game_base + 'rooms/';

  const __url_chat_base_ = __requests_url_base_ + 'chat/'

  async function _getRequest<T>(url: string): Promise<T | null> {
    return await axios.get(url).then(res => {
      return res.data;
    }).catch(() => {
      return null;
    });
  }
  
  async function _postRequest<T>(url: string): Promise<T | null> {
    return await axios.post(url).then(res => {
      return res.data;
    }).catch(() => {
      return null;
    });
  }

  async function _deleteRequest<T>(url: string): Promise<T | null> {
    return await axios.delete(url).then(res => {
      return res.data;
    }).catch(() => {
      return null;
    });
  }

  export async function getProfile(id: string): Promise<IUser | null> {
    return await _getRequest(__url_users_base_ + id);
  }

  export async function getUserMatchHistory(username: string): Promise<IRoom[]> {
    const data: IRoom[] | null = await _getRequest(__url_history_ + username);
    if (!data) {
      return [];
    }
    return data;
  }
  
  export async function getFriendList(username: string): Promise<IUser[]> {
    const data: IUser[] | null = await _getRequest(__url_friends_ + username);
    if (!data) {
      return [];
    }
    return data;
  }

  export async function getRankings(): Promise<IUser[]> {
    const data: IUser[] | null = await _getRequest(__url_rankings_);
    if (!data) {
      return [];
    }
    return data;
  }

  export async function getRoomList(): Promise<IRoom[]> {
    const data: IRoom[] | null = await _getRequest(__url_rooms_);
    if (!data) {
      return [];
    }
    return data;
  }

  export async function addFriend(username: string, friendUsername: string) {
    return await _postRequest(__url_add_friend_ + '?username=' + username + '&friendName=' + friendUsername);
  }

  export async function removeFriend(username: string, friendUsername: string) {
    return await _deleteRequest(__url_remove_friend_ + '?username=' + username + '&friendName=' + friendUsername);
  }

  export async function editUsername(username: string, newUsername: string): Promise<IUser | null> {
    return await _postRequest(__url_edit_username_ + '?username=' + username + '&newUsername=' + newUsername);
  }

  export async function isValidUsername(newUsername: string): Promise<string | null> {
    return await _getRequest(__url_valid_username_ + '?username=' + newUsername);
  }
}

export default Requests;