import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TUser } from './types';

export const BASE_URL = 'https://norma.nomoreparties.space/api/';

const checkResponse = async <T>(res: Response): Promise<T> => {
  const data = await res.json();
  if (res.ok) {
    return data;
  }
  throw data;
};

type TServerResponse<T> = {
  success: boolean;
} & T;

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

const checkSuccess = <T extends TServerResponse<unknown>>(data: T): T => {
  if (data?.success) {
    return data;
  }
  throw data;
};

const request = <T extends TServerResponse<unknown>>(
  endpoint: string,
  options?: RequestInit
) =>
  fetch(`${BASE_URL}${endpoint}`, options)
    .then((res) => checkResponse<T>(res))
    .then(checkSuccess);

const applyAuthHeader = (
  headers: HeadersInit | undefined,
  token: string
): HeadersInit => {
  if (headers instanceof Headers) {
    headers.set('authorization', token);
    return headers;
  }

  if (Array.isArray(headers)) {
    const filtered = headers.filter(
      ([key]) => key.toLowerCase() !== 'authorization'
    );
    return [...filtered, ['authorization', token]];
  }

  return {
    ...(headers ?? {}),
    authorization: token
  };
};

export const refreshToken = () =>
  request<TRefreshResponse>('auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  }).then((refreshData) => {
    localStorage.setItem('refreshToken', refreshData.refreshToken);
    setCookie('accessToken', refreshData.accessToken);
    return refreshData;
  });

export const fetchWithRefresh = async <T extends TServerResponse<unknown>>(
  endpoint: string,
  options: RequestInit = {}
) => {
  try {
    return await request<T>(endpoint, options);
  } catch (err) {
    const message = (err as { message?: string }).message;
    if (message === 'jwt expired' || message === 'You should be authorized') {
      const refreshData = await refreshToken();
      options.headers = applyAuthHeader(
        options.headers,
        refreshData.accessToken
      );
      return request<T>(endpoint, options);
    }
    throw err;
  }
};

type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;

export const getIngredientsApi = () =>
  request<TIngredientsResponse>('ingredients').then(({ data }) => data);

type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

export const getFeedsApi = () => request<TFeedsResponse>('orders/all');

export const getOrdersApi = () =>
  fetchWithRefresh<TFeedsResponse>('orders', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit
  }).then(({ orders }) => orders);

type TNewOrderResponse = TServerResponse<{
  order: TOrder;
  name: string;
}>;

export const orderBurgerApi = (data: string[]) =>
  fetchWithRefresh<TNewOrderResponse>('orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify({
      ingredients: data
    })
  });

type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

export const getOrderByNumberApi = (number: number) =>
  request<TOrderResponse>(`orders/${number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

export const registerUserApi = (data: TRegisterData) =>
  request<TAuthResponse>('auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  });

export type TLoginData = {
  email: string;
  password: string;
};

export const loginUserApi = (data: TLoginData) =>
  request<TAuthResponse>('auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  });

export const forgotPasswordApi = (data: { email: string }) =>
  request<TServerResponse<{}>>('password-reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  });

export const resetPasswordApi = (data: { password: string; token: string }) =>
  request<TServerResponse<{}>>('password-reset/reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  });

type TUserResponse = TServerResponse<{ user: TUser }>;

export const getUserApi = () =>
  fetchWithRefresh<TUserResponse>('auth/user', {
    headers: {
      authorization: getCookie('accessToken')
    } as HeadersInit
  });

export const updateUserApi = (user: Partial<TRegisterData>) =>
  fetchWithRefresh<TUserResponse>('auth/user', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify(user)
  });

export const logoutApi = () =>
  request<TServerResponse<{}>>('auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  });
