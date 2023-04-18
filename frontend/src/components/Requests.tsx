import axios from "axios";
import { IClient, IRoom } from "../types";

namespace Requests {
  const __requests_url_base_ = "http://localhost:3000/api/" + 'pong/'

  const __url_users_base_ = __requests_url_base_ + 'users/';
  const __url_edit_username = __requests_url_base_ + 'edit-username/';

  const __url_friends_base_ = __requests_url_base_ + 'friends/'
  const __url_add_friend_ = __requests_url_base_ + 'add-friend/'
  const __url_remove_friend_ = __requests_url_base_ + 'remove-friend/'

  const __url_history_base_ = __requests_url_base_ + 'history/';

  const url_chat = __requests_url_base_ + 'chat/channels'

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

  export async function getProfile(username: string): Promise<IClient | null> {
    return await _getRequest(__url_users_base_ + username);
  }

  export async function getUserMatchHistory(username: string): Promise<IRoom[]> {
    const data: IRoom[] | null = await _getRequest(__url_history_base_ + username);
    if (!data) {
      return [];
    }
    return data;
  }

  export async function getFriendList(username: string): Promise<IClient[]> {
    const data: IClient[] | null = await _getRequest(__url_friends_base_ + username);
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

  export async function editUsername(username: string, newUsername: string): Promise<IClient | null> {
    return await _postRequest(__url_edit_username + '?username=' + username + '&newUsername=' + newUsername);
  }
}

export default Requests;