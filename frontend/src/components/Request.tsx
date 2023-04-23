import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { IUser, IGameRoom } from "../types";

namespace __url_ {
  export const __api_base_url_ = "http://192.168.1.178:3000/api";
  export const __users_base_ = '/users';
  export const __game_base_ = '/pong';
  export const __chat_base_ = '/chat';
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
  export const __rankings_ = __users_base_ + '/get/rankings';

  // Game
  export const __rooms_ = __game_base_ + '/rooms';
  export const __history_ = __game_base_ + '/history';

  // Chat
  export const __channels_ = __chat_base_ + '/channels';
  export const __channel_ = __chat_base_ + '/channel';
}

class Request {
  private static __axios_: AxiosInstance;

  // This functions runs directly after its creation and acts like a constructor
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
          console.log('request: error 403');
          originalReq._retry = true;
          const url = __url_.__refresh_token_;
          try {
            await axios.post(url);
            return axios(originalReq);
          } catch (newError) {
            console.error('unable to refresh token');
            return Promise.reject(newError);
          }
        }
        return Promise.reject(error);
      }
    );
  })();

  private static async __make_get_request_<T>(url: string): Promise<T | null> {
    return await Request.__axios_.get(url).then(res => {
      return res.data;
    }).catch(() => {
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
    }).catch(() => {
      return null;
    });
  }

  private static async __make_delete_request_<T>(url: string): Promise<T | null> {
    return await Request.__axios_.delete(url).then(res => {
      return res.data;
    }).catch(() => {
      return null;
    });
  }

  public static async signIn(code: string | null): Promise<any | null> {
    return await Request.__make_post_request_(__url_.__sign_in_, { code: code });
  }

  public static async signOut(): Promise<any | null> {
    return await Request.__make_get_request_(__url_.__sign_out_);
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
    return this.__make_array_get_request_(__url_.__history_ + '/' + id);
  }

  public static async getRankings(): Promise<IUser[]> {
    return this.__make_array_get_request_(__url_.__rankings_);
  }

  public static async getRoomList(): Promise<IGameRoom[]> {
    return this.__make_array_get_request_(__url_.__rooms_);
  }

  public static async addFriend(friendUsername: string) {
    return await Request.__make_post_request_(__url_.__add_friend_, { friendUsername: friendUsername });
  }

  public static async removeFriend(friendUsername: string) {
    return await Request.__make_delete_request_(__url_.__remove_friend_ + '/' + friendUsername);
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
}

export default Request;