"use client";
import { getSession, signOut } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

export interface Values {
  user: Record<string, any>;
  logout: () => void;
  getFiles: () => void;
  createFile: () => void;
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

  // Get all files
  const getFiles = async () => {
    try {
      const response = await fetch("/api/list_files", {
        method: "POST",
      });
      const responseJson = await response.json();
      console.log(responseJson);
    } catch (error) {
      console.log(error);
    }
  };

  // Create file
  const createFile = async () => {
    try {
      const response = await fetch("/api/create_file", {
        method: "POST",
        body: JSON.stringify({ name: "config.txt", content: "Hello World" }),
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
    getFiles,
    createFile,
  };

  return <globalContext.Provider value={values}>{children}</globalContext.Provider>;
}

export function useGlobal() {
  return useContext(globalContext);
}
