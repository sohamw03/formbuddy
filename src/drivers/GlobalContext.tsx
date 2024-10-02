"use client";
import { getSession, signOut } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import { getDriveClient } from "./ConnectDrive";

export interface Values {
  user: Record<string, any>;
  logout: () => void;
  getDriveAppDataFolder: () => void;
}

const globalContext = createContext<Values>({} as Values);

export function GlobalContextProvider({ children }: { children: React.ReactNode }) {
  // Global states
  const [user, setUser] = useState<Record<string, any>>({ loggedIn: false });

  // Auth logout
  const logout = async () => {
    // Sign out from next-auth
    signOut();
    setUser(() => ({ loggedIn: false }));
  };

  // Get drive appdata folder
  const getDriveAppDataFolder = async () => {
    try {
      const response = await fetch("/api/c_drive", {
        method: "POST",
      });
      const responseJson = await response.json();
      console.log(responseJson);
    } catch (error) {
      console.log(error);
    }
  };

  // Load state from local storage on reload
  useEffect(() => {
    const loadStateFromLocal = async () => {
      try {
        const token = await getSession();
        if (token) {
          setUser(() => ({ ...token.user, loggedIn: true }));
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadStateFromLocal();
  }, []);

  const values: Values = {
    user,
    logout,
    getDriveAppDataFolder,
  };

  return <globalContext.Provider value={values}>{children}</globalContext.Provider>;
}

export function useGlobal() {
  return useContext(globalContext);
}
