"use client";
import type { Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import { logout } from "./slice";
import toast from "react-hot-toast";

export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action: any) => {
    if (isRejectedWithValue(action)) {
      if (action.meta.arg.endpointName == "getProfile") {
        return;
      } else if (
        action?.payload.status == 401 &&
        action.meta.arg.endpointName != "login"
      ) {
        api.dispatch(logout())
      } else {
        const errorData =
          action.payload.data?.error?.message ||
          action.payload.data?.message ||
          action.error.message;
        if (errorData.includes("JWT expired")){
          api.dispatch(logout())
          toast.error("Session expired! Please log in again.")
        }
      }
    }
    return next(action);
  };
