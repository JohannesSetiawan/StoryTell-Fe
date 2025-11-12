import { baseApi } from "./baseApi";
import {
  LoginResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  UserInfoResponse,
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
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLazyGetUserInfoQuery,
  useGetUserInfoQuery,
  useUpdateProfileMutation,
  useGetUserByUsernameQuery,
} = authApi;
