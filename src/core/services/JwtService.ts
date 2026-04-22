const ID_TOKEN_KEY = "id_token" as string;
const REFRESH_TOKEN = "refresh_token" as string;

export const getToken = (): string | null => {
  return window.localStorage.getItem(ID_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return window.localStorage.getItem("refresh_token");
}

export const saveToken = (token: string): void => {
  window.localStorage.setItem(ID_TOKEN_KEY, token);
};

export const saveRefreshToken = (token: string): void => {
  window.localStorage.setItem(REFRESH_TOKEN, token);
}

export const destroyToken = (): void => {
  window.localStorage.removeItem(ID_TOKEN_KEY);
};

export const destroyRefreshToken = (): void => {
  window.localStorage.removeItem(REFRESH_TOKEN);
}

export default { getToken, saveToken, destroyToken, getRefreshToken, saveRefreshToken, destroyRefreshToken };