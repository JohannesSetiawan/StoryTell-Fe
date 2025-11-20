import { baseApi } from "./baseApi";
import {
  LoginResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  UserInfoResponse,
  UserListResponse,
} from "../types/auth";

const AUTH_API = import.meta.env.VITE_API_URL + "user";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: AUTH_API + "/login",
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({
        url: AUTH_API + "/register",
        method: "POST",
        body,
      }),
    }),
    getUserInfo: builder.query<UserInfoResponse, void>({
      query: () => ({
        url: AUTH_API,
        method: "GET",
      }),
      providesTags: ['UserProfile'],
    }),
    updateProfile: builder.mutation<UserInfoResponse, { username?: string; password?: string; description?: string }>({
      query: (body) => ({
        url: AUTH_API,
        method: "PUT",
        body,
      }),
      invalidatesTags: ['UserProfile'],
    }),
    getUserByUsername: builder.query<UserInfoResponse, string>({
      query: (username) => ({
        url: AUTH_API + `/username/${username}`,
        method: "GET",
      }),
    }),
    getUserList: builder.query<UserListResponse, { page?: number; perPage?: number; username?: string }>({
      query: ({ page = 1, perPage = 20, username }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('perPage', perPage.toString());
        if (username && username.trim() !== '') {
          params.append('username', username);
        }
        return {
          url: AUTH_API + `/list?${params.toString()}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLazyGetUserInfoQuery,
  useGetUserInfoQuery,
  useUpdateProfileMutation,
  useGetUserByUsernameQuery,
  useGetUserListQuery,
} = authApi;
