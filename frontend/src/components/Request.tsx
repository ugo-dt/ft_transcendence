import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { IUser, IGameRoom } from "../types";

namespace __url_ {
  export const __api_base_url_ = `${import.meta.env.VITE_BACKEND_HOST}/api`;
  export const __app_base_ = '/app';
  export const __users_base_ = '/users';
  export const __game_base_ = '/pong';
  export const __chat_base_ = '/chat';
  export const __auth_base_ = '/auth';

  // Auth
  export const __sign_in_ = __auth_base_ + '/signin';
  export const __sign_out_ = __auth_base_ + '/signout';
  export const __refresh_token_ = __auth_base_ + '/refresh';
  export const __generate_otp__ = __auth_base_ + '/genotp';
  export const __validate_otp__ = __auth_base_ + '/valotp';
  export const __generate_login_otp__ = __auth_base_ + '/genloginotp';
  export const __validate_login_otp__ = __auth_base_ + '/valloginotp';

  // Users
  export const __users_me_ = __users_base_ + '/me';
  export const __users_id_ = __users_base_ + '/id';
  export const __edit_username_ = __users_base_ + '/edit/username';
  export const __edit_avatar_ = __users_base_ + '/edit/avatar';
  export const __valid_username_ = __users_base_ + '/edit/is-valid-username';
  export const __add_friend_ = __users_base_ + '/add-friend'
  export const __remove_friend_ = __users_base_ + '/remove-friend'
  export const __rankings_ = __users_base_ + '/get/rankings';
  export const __edit_paddle_ = __users_base_ + '/edit/paddle-color';
  export const __disable_2fa_ = __users_base_ + '/disable2fa';

  // Game
  export const __rooms_ = __game_base_ + '/rooms';
  export const __history_ = __game_base_ + '/history';

  // Chat
  export const __channels_ = __chat_base_ + '/channels';
  export const __channel_ = __chat_base_ + '/channel';
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
    return await Request.__axios_.get(url, {signal: this.controller.signal}).then(res => {
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

  public static async generateOtp(phoneNumber: string): Promise<any | null> {
    return await Request.__make_post_request_(__url_.__generate_otp__, {phoneNumber});
  }

  public static async validateOtp(phoneNumber: string, code: string): Promise<any | null> {
    return await Request.__make_post_request_(__url_.__validate_otp__, {phoneNumber, code});
  }

  public static async generateLoginOtp(): Promise<any | null> {
    return await Request.__make_post_request_(__url_.__generate_login_otp__);
  }

  public static async validateLoginOtp(code: string): Promise<any | null> {
    return await Request.__make_post_request_(__url_.__validate_login_otp__, {code});
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

  public static async disable2fa(): Promise<IUser | null> {
    return await Request.__make_post_request_(__url_.__disable_2fa_);
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

  public static async editPaddleColor(color: string): Promise<IUser | null> {
    return await Request.__make_post_request_(__url_.__edit_paddle_, { color: color });
  }
}

export default Request;