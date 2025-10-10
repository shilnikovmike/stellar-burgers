import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { authChecked } from './userSlice';

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => registerUserApi(data)
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => loginUserApi(data)
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () =>
  logoutApi()
);

export const updateUserData = createAsyncThunk(
  'user/updateUserData',
  async (data: Partial<TRegisterData>) => updateUserApi(data)
);

export const getUserData = createAsyncThunk('user/getUserData', async () =>
  getUserApi()
);

export const checkAuthUser = createAsyncThunk(
  'user/checkAuthUser',
  async (_, { dispatch }) => {
    if (localStorage.getItem('refreshToken')) {
      dispatch(getUserData()).finally(() => {
        dispatch(authChecked());
      });
    } else {
      dispatch(authChecked());
    }
  }
);

export const resetUserPassword = createAsyncThunk(
  'user/resetUserPassword',
  async (data: { password: string; token: string }) => resetPasswordApi(data)
);
