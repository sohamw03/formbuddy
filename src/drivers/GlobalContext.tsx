// Residence: Frontend
"use client";
import { getSession, signIn, signOut } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

export interface Values {
  user: Record<string, any>;
  files: Array<{ name: string; id: string; mimeType: string; parents: string[]; thumbnailLink: string }>;
  logout: () => void;
  listFiles: () => void;
  createFile: (file: File, folder: string) => void;
  removeFile: (id: string, folder: string) => void;
  initUserDirective: (doListFiles: boolean) => void;
}

const globalContext = createContext<Values>({} as Values);

export function GlobalContextProvider({ children }: { children: React.ReactNode }) {
  // Global states
  const [user, setUser] = useState<Record<string, any>>({ loggedIn: false });
  const [files, setFiles] = useState<Array<{ name: string; id: string; mimeType: string; parents: string[]; thumbnailLink: string }>>([]);

  // Auth logout
  const logout = async () => {
    // Sign out from next-auth
    signOut();
    setUser(() => ({ loggedIn: false }));
    setFiles([]);
  };

  // Maintain directory structure
  const initUserDirective = async (doListFiles: boolean) => {
    setTimeout(async () => {
      try {
        const response = await fetch("/api/init_user", { method: "POST" });
        const responseJson = await response.json();
        console.log(responseJson);

        if (doListFiles)
          setTimeout(async () => {
            await listFiles();
          }, 1000);
      } catch (error) {
        console.log(error);
      }
    }, 1000);
  };

  // List all files
  const listFiles = async () => {
    try {
      const response = await fetch("/api/list_files", {
        method: "POST",
      });
      const responseJson = await response.json();
      console.log(responseJson);
      setFiles(
        responseJson.files.map((file: any) => ({
          name: file.name,
          id: file.id,
          mimeType: file.mimeType,
          parents: file.parents,
          thumbnailLink: file.thumbnailLink,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Create file
  const createFile = async (file: File, folder: string) => {
    try {
      const payload = new FormData();
      payload.append("name", file.name);
      payload.append("content", file);
      payload.append("folder_id", `${files.find((file) => file.name === folder && file.mimeType === "application/vnd.google-apps.folder")?.id}`);
      const response = await fetch("/api/create_file", {
        method: "POST",
        body: payload,
      });
      const responseJson = await response.json();
      console.log(responseJson);
      listFiles();
    } catch (error) {
      console.log(error);
    }
  };

  // Remove file
  const removeFile = async (id: string, folder: string) => {
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
    initUserDirective,
  };

  return <globalContext.Provider value={values}>{children}</globalContext.Provider>;
}

export function useGlobal() {
  return useContext(globalContext);
}
