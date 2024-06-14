import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { baseApi } from './api/baseApi'
import userReducer from './slice';

const persistConfig = {
  key: 'root',
  storage,
}

export const rootReducer = combineReducers({
  api: baseApi.reducer,
  user: persistReducer(persistConfig, userReducer),
})
