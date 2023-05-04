import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { IUser, IGameRoom } from "../types";
import { IChannel } from "../types/IChannel";
import { IMessage } from "../types/IMessage";
import { PADDLE_COLORS } from "../constants";

namespace __url_ {
  export const __api_base_url_ = `${import.meta.env.VITE_BACKEND_HOST}/api`;
  export const __app_base_ = '/app';
  export const __users_base_ = '/users';
  export const __game_base_ = '/pong';
  export const __chat_base_ = '/chat';
  export const __channels_base_ = '/channels';
  export const __auth_base_ = '/auth';

  // Auth
  export const __sign_in_ = __auth_base_ + '/signin';
  export const __sign_out_ = __auth_base_ + '/signout';
  export const __refresh_token_ = __auth_base_ + '/refresh';

  // Users
  export const __users_me_ = __users_base_ + '/me';
  export const __users_id_ = __users_base_ + '/id';
  export const __edit_username_ = __users_base_ + '/edit/username';
  export const __edit_avatar_ = __users_base_ + '/edit/avatar';
  export const __valid_username_ = __users_base_ + '/edit/is-valid-username';
  export const __add_friend_ = __users_base_ + '/add-friend'
  export const __remove_friend_ = __users_base_ + '/remove-friend'
  export const __block_user_ = __users_base_ + '/block-user'
  export const __unblock_user_ = __users_base_ + '/unblock-user'
  export const __rankings_ = __users_base_ + '/get/rankings';
  export const __user_ranking_ = __users_base_ + '/get/user-ranking';
  export const __edit_paddle_ = __users_base_ + '/edit/paddle-color';

  // Game
  export const __rooms_ = __game_base_ + '/rooms';
  export const __history_ = __game_base_ + '/history';

  // Chat
  export const __all_channels_ = __channels_base_ + '/all';
  export const __edit_channel_password_ = __users_base_ + '/channels/edit-channel-password';
  export const __remove_password_ = __users_base_ + '/channels/remove-password';
  export const __user_channels_ = __users_base_ + '/channels/user-channels';
  export const __channel_users_ = __users_base_ + '/channels/channel-users';
  export const __create_channel_ = __users_base_ + '/channels/create-channel';
  export const __join_channel_ = __users_base_ + '/channels/join-channel';
  export const __leave_channel_ = __users_base_ + '/channels/leave-channel';
  export const __check_password_ = __users_base_ + '/channels/check-password';
  export const __message_ = __chat_base_ + '/message';
}

class Request {
  private static __axios_: AxiosInstance;
  private static controller = new AbortController();

  // This function runs directly after its creation and acts like a constructor
  private static __init__ = (() => {
    Request.__axios_ = axios.create({
      baseURL: __url_.__api_base_url_,
      withCredentials: true,
    });
    Request.__axios_.interceptors.response.use(
      res => res,
      async (error) => {
        const originalReq = error.config;
        if (error.response.status === 403 && !originalReq._retry) {
          // console.log('request: error 403');
          originalReq._retry = true;
          const url = __url_.__refresh_token_;
          try {
            await axios.post(url);
            return axios(originalReq);
          } catch (newError) {
            // console.error('unable to refresh token');
            return Promise.reject(newError);
          }
        }
        return Promise.reject(error);
      }
    );
  })();

  private static async __make_get_request_<T>(url: string): Promise<T | null> {
    return await Request.__axios_.get(url, { signal: this.controller.signal }).then(res => {
      return res.data;
    }).catch(err => {
      if (axios.isAxiosError(err) && err.code === "ERR_CANCELED") {
        console.error("Request has been canceled!");
      }
      return null;
    });
  }

  private static async __make_array_get_request_<T>(url: string): Promise<T[]> {
    const data: T[] | null = await Request.__make_get_request_(url);
    return data ? data : [];
  }

  private static async __make_post_request_<T>(url: string, data?: any, config?: AxiosRequestConfig<any> | undefined): Promise<T | null> {
    return await Request.__axios_.post(url, data, config).then(res => {
      return res.data;
    }).catch(err => {
      if (axios.isAxiosError(err) && err.code === "ERR_CANCELED") {
        console.error("Request has been canceled!");
      }
      return null;
    });
  }

  private static async __make_delete_request_<T>(url: string): Promise<T | null> {
    return await Request.__axios_.delete(url).then(res => {
      return res.data;
    }).catch(err => {
      if (axios.isAxiosError(err) && err.code === "ERR_CANCELED") {
        console.error("Request has been canceled!");
      }
      return null;
    });
  }

  public static async isServerAvailable(): Promise<boolean> {
    return await Request.__axios_.head(__url_.__app_base_ + '/is-available').then(res => {
      return res.status === 200;
    }).catch(err => {
      if (axios.isAxiosError(err) && err.code === "ERR_CANCELED") {
        console.error("Request has been canceled!");
      }
      return false;
    });
  }

  public static async signIn(code: string | null): Promise<any | null> {
    return await Request.__make_post_request_(__url_.__sign_in_, { code: code });
  }

  public static async signOut(): Promise<any | null> {
    return await Request.__make_post_request_(__url_.__sign_out_);
  }

  public static async refreshToken(): Promise<any | null> {
    return await Request.__make_get_request_(__url_.__refresh_token_);
  }

  public static async me(): Promise<IUser | null> {
    return await Request.__make_get_request_(__url_.__users_me_);
  }

  public static async getProfile(username: string): Promise<IUser | null> {
    return await Request.__make_get_request_(__url_.__users_base_ + '/' + username);
  }

  public static async getProfileFromId(id: number): Promise<IUser | null> {
    return await Request.__make_get_request_(__url_.__users_id_ + '/' + id);
  }

  public static async getUserMatchHistory(id: number): Promise<IGameRoom[]> {
    return Request.__make_array_get_request_(__url_.__history_ + '/' + id);
  }

  public static async getRankings(): Promise<IUser[]> {
    return Request.__make_array_get_request_(__url_.__rankings_);
  }

  public static async getUserRanking(id: number): Promise<number | null> {
    return this.__make_get_request_(__url_.__user_ranking_ + '/' + id);
  }

  public static async getRoomList(): Promise<IGameRoom[]> {
    return Request.__make_array_get_request_(__url_.__rooms_);
  }

  public static async addFriend(friendId: number) {
    return await Request.__make_post_request_(__url_.__add_friend_, { friendId: friendId });
  }

  public static async removeFriend(friendId: number) {
    return await Request.__make_delete_request_(__url_.__remove_friend_ + '/' + friendId);
  }

  public static async isValidUsername(newUsername: string): Promise<string | null> {
    return await Request.__make_get_request_(__url_.__valid_username_ + '?username=' + newUsername);
  }

  public static async editUsername(newUsername: string): Promise<IUser | null> {
    return await Request.__make_post_request_(__url_.__edit_username_, { username: newUsername });
  }

  public static async editAvatar(formData: FormData): Promise<IUser | null> {
    return await Request.__make_post_request_(
      __url_.__edit_avatar_,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  public static async resetAvatar(): Promise<IUser | null> {
    return await Request.__make_delete_request_(__url_.__edit_avatar_);
  }

  public static async editPaddleColor(color: PADDLE_COLORS): Promise<IUser | null> {
    return await Request.__make_post_request_(__url_.__edit_paddle_, { color: color });
  }

  /*---Chat---*/
  public static async blockUser(id: number): Promise<IUser | null> {
    return await Request.__make_post_request_(__url_.__block_user_, { id: id });
  }

  public static async unblockUser(id: number): Promise<IUser | null> {
    return await Request.__make_delete_request_(__url_.__unblock_user_ + '/' + id);
  }

  public static async createChannel(name: string, password: string, isPrivate: boolean): Promise<IChannel | null> {
    return await Request.__make_post_request_(__url_.__create_channel_, { name: name, password: password, isPrivate: isPrivate });
  }

  public static async getUserChannels(): Promise<IChannel[]> {
    return await Request.__make_array_get_request_(__url_.__user_channels_);
  }

  public static async getChannelUsers(id: number): Promise<IUser[]> {
    return await Request.__make_array_get_request_(__url_.__channel_users_ + '/' + id);
  }

  public static async joinChannel(id: number, password: string): Promise<IChannel | null> {
    return await Request.__make_post_request_(__url_.__join_channel_, { id: id, password: password });
  }

  public static async leaveChannel(id: number) {
    return await Request.__make_delete_request_(__url_.__leave_channel_ + '/' + id);
  }

  public static async editChannelPassword(channelId: number, newPassword: string): Promise<IChannel | null> {
    return await Request.__make_post_request_(__url_.__edit_channel_password_, { channelId: channelId, newPassword: newPassword });
  }

  public static async getAllChannels(): Promise<IChannel[]> {
    return await Request.__make_array_get_request_(__url_.__all_channels_);
  }

  public static async checkPassword(id: number, password: string): Promise<boolean | null> {
    return await Request.__make_post_request_(__url_.__check_password_, { password: password });
  }

  public static async getMessage(id: number): Promise<IMessage | null> {
    return await Request.__make_get_request_(__url_.__message_ + '/' + id);
  }
}

export default Request;