import { createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  getUserData,
  loginUser,
  logoutUser,
  registerUser,
  resetUserPassword,
  updateUserData
} from './actions';
import { deleteCookie, setCookie } from '../../../utils/cookie';

type TUserProps = {
  user: TUser | null;
  isAuthChecked: boolean;
  isUserLoading: boolean;
  isRegisterLoading: boolean;
  isLoginLoading: boolean;
  isLogoutUser: boolean;
  isUpdateUserLoading: boolean;
  isResetPasswordLoading: boolean;
  isUpdatePassword: boolean;
  errMsg?: string;
};

export const initialState: TUserProps = {
  user: null,
  isAuthChecked: false,
  isUserLoading: false,
  isRegisterLoading: false,
  isLoginLoading: false,
  isLogoutUser: false,
  isUpdateUserLoading: false,
  isResetPasswordLoading: false,
  isUpdatePassword: false,
  errMsg: ''
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getUserData.pending, (state) => {
        state.isUserLoading = true;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.user = action.payload.user;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.isUserLoading = false;
        state.errMsg = action.error?.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.isRegisterLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isRegisterLoading = false;

        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);

        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isRegisterLoading = false;
        state.errMsg = action.error?.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoginLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoginLoading = false;

        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);

        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoginLoading = false;
        state.errMsg = action.error?.message;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLogoutUser = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLogoutUser = false;
        state.user = null;

        localStorage.clear();
        deleteCookie('accessToken');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLogoutUser = false;
        state.errMsg = action.error?.message;
      })
      .addCase(updateUserData.pending, (state) => {
        state.isUpdateUserLoading = true;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.isUpdateUserLoading = false;
        state.user = action.payload.user;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.isUpdateUserLoading = false;
        state.errMsg = action.error?.message;
      })
      .addCase(resetUserPassword.pending, (state) => {
        state.isResetPasswordLoading = true;
      })
      .addCase(resetUserPassword.fulfilled, (state, action) => {
        state.isResetPasswordLoading = false;
        state.isUpdatePassword = action.payload.success;
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.isResetPasswordLoading = false;
        state.errMsg = action.error?.message;
      });
  },
  selectors: {
    getStoreUserData: (state) => state.user,
    getStoreLoadUserData: (state) => state.isUserLoading,
    getStoreLoadAuthChecked: (state) => state.isAuthChecked,
    getStoreLoadRegister: (state) => state.isRegisterLoading,
    getStoreLoadLogout: (state) => state.isLogoutUser,
    getStoreLoadLogin: (state) => state.isLoginLoading,
    getStoreLoadUpdateUserData: (state) => state.isUpdateUserLoading
  }
});

export const { authChecked } = userSlice.actions;
export const {
  getStoreLoadAuthChecked,
  getStoreLoadUserData,
  getStoreUserData,
  getStoreLoadRegister,
  getStoreLoadLogout,
  getStoreLoadLogin,
  getStoreLoadUpdateUserData
} = userSlice.selectors;
export const userReducer = userSlice.reducer;
