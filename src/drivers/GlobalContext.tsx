"use client";
import { getSession, signIn, signOut } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

export interface Values {
  user: Record<string, any>;
  files: Array<{ name: string; id: string }>;
  logout: () => void;
  listFiles: () => void;
  createFile: () => void;
  removeFile: (id: string) => void;
}

const globalContext = createContext<Values>({} as Values);

export function GlobalContextProvider({ children }: { children: React.ReactNode }) {
  // Global states
  const [user, setUser] = useState<Record<string, any>>({ loggedIn: false });
  const [files, setFiles] = useState<Array<{ name: string; id: string }>>([]);

  // Auth logout
  const logout = async () => {
    // Sign out from next-auth
    signOut();
    setUser(() => ({ loggedIn: false }));
  };

  // List all files
  const listFiles = async () => {
    try {
      const response = await fetch("/api/list_files", {
        method: "POST",
      });
      const responseJson = await response.json();
      console.log(responseJson);
      setFiles(responseJson.files.map((file: any) => ({ name: file.name, id: file.id })));
    } catch (error) {
      console.log(error);
    }
  };

  // Create file
  const createFile = async () => {
    try {
      const response = await fetch("/api/create_file", {
        method: "POST",
        body: JSON.stringify({ name: `${new Date().toISOString().replace(/T/, " ").replace(/\..+/, "")}.txt`, content: "Hello World" }),
      });
      const responseJson = await response.json();
      console.log(responseJson);
      listFiles();
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
      listFiles();
    } catch (error) {
      console.log(error);
    }
  };

  // Load state from local storage on reload
  useEffect(() => {
    const loadStateFromLocal = async () => {
      try {
        const sessionToken = (await getSession()) as any;
        if (sessionToken) {
          if (sessionToken.error === "RefreshTokenError") {
            try {
              const result = await signIn("google", { redirect: false, callbackUrl: "/" });
              if (result?.error) {
                console.error(result.error);
              }
            } catch (error) {
              console.error(error);
            }
          }
          setUser(() => ({ ...sessionToken.user, loggedIn: true }));
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadStateFromLocal();
  }, []);

  const values: Values = {
    user,
    files,
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
