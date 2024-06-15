import { createContext } from "react";

export const UserDataContext = createContext({
  getUserData: () => {},
  setUserData: () => {},
  setToken: () => {},
  getToken: () => {},
});

export const UserDataProvider = UserDataContext.Provider;
