"use client";
import { getSession, signOut } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

export interface Values {
  user: Record<string, any>;
  logout: () => void;
  listFiles: () => Promise<Array<{ name: string; id: string }>>;
  createFile: () => void;
  removeFile: (id: string) => void;
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

  // List all files
  const listFiles = async (): Promise<Array<{ name: string; id: string }>> => {
    try {
      const response = await fetch("/api/list_files", {
        method: "POST",
      });
      const responseJson = await response.json();
      console.log(responseJson);
      return responseJson.files;
    } catch (error) {
      console.log(error);
      return [];
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

  // Remove file
  const removeFile = async (id: string) => {
    try {
      const response = await fetch("/api/remove_file", {
        method: "POST",
        body: JSON.stringify({ id: id }),
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
    listFiles,
    createFile,
    removeFile,
  };

  return <globalContext.Provider value={values}>{children}</globalContext.Provider>;
}

export function useGlobal() {
  return useContext(globalContext);
}
