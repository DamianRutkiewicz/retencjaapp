import { LOCAL_STORAGE_FAVORITE_KEY } from './constant';

export const setIsFavoriteToLStorage = (usersIds: number[]) => {
  localStorage.setItem(
    LOCAL_STORAGE_FAVORITE_KEY,
    JSON.stringify([...new Set(usersIds)])
  );
};

export const getFavoriteUsersLStorage = () => {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVORITE_KEY) || '[]');
};
