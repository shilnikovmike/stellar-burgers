import { userReducer, initialState, authChecked } from './userSlice';
import {
  getUserData,
  loginUser,
  logoutUser,
  registerUser,
  resetUserPassword,
  updateUserData
} from './actions';
import { TRegisterData, TLoginData } from '@api';
import { TUser } from '@utils-types';

const userMock: TUser = {
  name: 'Test User',
  email: 'test@example.com'
};

const registerPayload: TRegisterData = {
  email: 'test@example.com',
  name: 'Test User',
  password: 'password'
};

const loginPayload: TLoginData = {
  email: 'test@example.com',
  password: 'password'
};

const updatePayload: Partial<TRegisterData> = {
  name: 'Updated User'
};

const resetPasswordPayload = {
  password: 'new-password',
  token: 'reset-token'
};

const authResponseMock = {
  success: true,
  user: userMock,
  accessToken: 'Bearer test-token',
  refreshToken: 'refresh-token'
};

const userResponseMock = {
  success: true,
  user: userMock
};

describe('userSlice reducer', () => {
  it('Должен вернуть исходное состояние при неизвестном экшене', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('Должен обработать редьюсер authChecked', () => {
    const state = userReducer(initialState, authChecked());

    expect(state.isAuthChecked).toBe(true);
  });

  it('Должен обработать getUserData.pending', () => {
    const state = userReducer(initialState, getUserData.pending('', undefined));

    expect(state.isUserLoading).toBe(true);
  });

  it('Должен обработать getUserData.fulfilled', () => {
    const loadingState = { ...initialState, isUserLoading: true };

    const state = userReducer(
      loadingState,
      getUserData.fulfilled(userResponseMock, '', undefined)
    );

    expect(state.isUserLoading).toBe(false);
    expect(state.user).toEqual(userMock);
  });

  it('Должен обработать getUserData.rejected', () => {
    const loadingState = { ...initialState, isUserLoading: true };
    const error = new Error('Получение пользователя завершилось ошибкой');

    const state = userReducer(
      loadingState,
      getUserData.rejected(error, '', undefined)
    );

    expect(state.isUserLoading).toBe(false);
    expect(state.errMsg).toBe('Получение пользователя завершилось ошибкой');
  });

  it('Должен обработать registerUser.pending', () => {
    const state = userReducer(
      initialState,
      registerUser.pending('', registerPayload)
    );

    expect(state.isRegisterLoading).toBe(true);
  });

  it('Должен обработать registerUser.fulfilled', () => {
    const loadingState = { ...initialState, isRegisterLoading: true };

    const state = userReducer(
      loadingState,
      registerUser.fulfilled(authResponseMock, '', registerPayload)
    );

    expect(state.isRegisterLoading).toBe(false);
    expect(state.user).toEqual(userMock);
  });

  it('Должен обработать registerUser.rejected', () => {
    const loadingState = { ...initialState, isRegisterLoading: true };
    const error = new Error('Регистрация завершилась ошибкой');

    const state = userReducer(
      loadingState,
      registerUser.rejected(error, '', registerPayload)
    );

    expect(state.isRegisterLoading).toBe(false);
    expect(state.errMsg).toBe('Регистрация завершилась ошибкой');
  });

  it('Должен обработать loginUser.pending', () => {
    const state = userReducer(
      initialState,
      loginUser.pending('', loginPayload)
    );

    expect(state.isLoginLoading).toBe(true);
  });

  it('Должен обработать loginUser.fulfilled', () => {
    const loadingState = { ...initialState, isLoginLoading: true };

    const state = userReducer(
      loadingState,
      loginUser.fulfilled(authResponseMock, '', loginPayload)
    );

    expect(state.isLoginLoading).toBe(false);
    expect(state.user).toEqual(userMock);
    expect(state.isAuthChecked).toBe(true);
  });

  it('Должен обработать loginUser.rejected', () => {
    const loadingState = { ...initialState, isLoginLoading: true };
    const error = new Error('Авторизация завершилась ошибкой');

    const state = userReducer(
      loadingState,
      loginUser.rejected(error, '', loginPayload)
    );

    expect(state.isLoginLoading).toBe(false);
    expect(state.errMsg).toBe('Авторизация завершилась ошибкой');
  });

  it('Должен обработать logoutUser.pending', () => {
    const state = userReducer(initialState, logoutUser.pending('', undefined));

    expect(state.isLogoutUser).toBe(true);
  });

  it('Должен обработать logoutUser.fulfilled', () => {
    const loadingState = {
      ...initialState,
      isLogoutUser: true,
      user: userMock
    };

    const state = userReducer(
      loadingState,
      logoutUser.fulfilled({ success: true }, '', undefined)
    );

    expect(state.isLogoutUser).toBe(false);
    expect(state.user).toBeNull();
  });

  it('Должен обработать logoutUser.rejected', () => {
    const loadingState = { ...initialState, isLogoutUser: true };
    const error = new Error('Выход завершился ошибкой');

    const state = userReducer(
      loadingState,
      logoutUser.rejected(error, '', undefined)
    );

    expect(state.isLogoutUser).toBe(false);
    expect(state.errMsg).toBe('Выход завершился ошибкой');
  });

  it('Должен обработать updateUserData.pending', () => {
    const state = userReducer(
      initialState,
      updateUserData.pending('', updatePayload)
    );

    expect(state.isUpdateUserLoading).toBe(true);
  });

  it('Должен обработать updateUserData.fulfilled', () => {
    const loadingState = { ...initialState, isUpdateUserLoading: true };

    const state = userReducer(
      loadingState,
      updateUserData.fulfilled(userResponseMock, '', updatePayload)
    );

    expect(state.isUpdateUserLoading).toBe(false);
    expect(state.user).toEqual(userMock);
  });

  it('Должен обработать updateUserData.rejected', () => {
    const loadingState = { ...initialState, isUpdateUserLoading: true };
    const error = new Error('Обновление завершилось ошибкой');

    const state = userReducer(
      loadingState,
      updateUserData.rejected(error, '', updatePayload)
    );

    expect(state.isUpdateUserLoading).toBe(false);
    expect(state.errMsg).toBe('Обновление завершилось ошибкой');
  });

  it('Должен обработать resetUserPassword.pending', () => {
    const state = userReducer(
      initialState,
      resetUserPassword.pending('', resetPasswordPayload)
    );

    expect(state.isResetPasswordLoading).toBe(true);
  });

  it('Должен обработать resetUserPassword.fulfilled', () => {
    const loadingState = { ...initialState, isResetPasswordLoading: true };

    const state = userReducer(
      loadingState,
      resetUserPassword.fulfilled({ success: true }, '', resetPasswordPayload)
    );

    expect(state.isResetPasswordLoading).toBe(false);
    expect(state.isUpdatePassword).toBe(true);
  });

  it('Должен обработать resetUserPassword.rejected', () => {
    const loadingState = { ...initialState, isResetPasswordLoading: true };
    const error = new Error('Сброс пароля завершился ошибкой');

    const state = userReducer(
      loadingState,
      resetUserPassword.rejected(error, '', resetPasswordPayload)
    );

    expect(state.isResetPasswordLoading).toBe(false);
    expect(state.errMsg).toBe('Сброс пароля завершился ошибкой');
  });
});
