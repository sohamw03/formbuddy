// Residence: Frontend
"use client";
import { useDisclosure } from "@nextui-org/react";
import { getSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { type Crop } from "react-image-crop";

const globalContext = createContext<Values>({} as Values);

export function GlobalContextProvider({ children }: { children: React.ReactNode }) {
  // Global states
  const [user, setUser] = useState<Record<string, any>>({ loggedIn: false });
  const [files, setFiles] = useState<Array<fileObj>>([]);
  const [openedFileId, setOpenedFileId] = useState("");
  const [currFolder, setCurrFolder] = useState<currFolderType>("home");
  // Refs
  const currImgRef = useRef<HTMLImageElement>(null);
  // NextUI modal
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Toolbar states
  const [toolbarMode, setToolbarMode] = useState<toolbarModeType>("normal");

  const path = usePathname();

  // Auth logout
  const logout = async () => {
    // Sign out from next-auth
    signOut();
    setUser(() => ({ loggedIn: false }));
    setFiles([]);
  };

  // Auth login
  const login = async () => {
    try {
      const result = await signIn("google", { redirect: false, callbackUrl: "/" });
      if (result?.error) {
        console.error(result.error);
      }
    } catch (error) {
      console.error(error);
    }
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
      const filesLocal = await Promise.all(
        responseJson.files.map(async (file: any) => ({
          name: file.name,
          id: file.id,
          mimeType: file.mimeType,
          parents: file.parents,
          thumbnailLink: file.thumbnailLink,
          blobURL: `${file.mimeType.includes("image") ? await downFile(file.id) : ""}`,
        }))
      );
      setFiles(filesLocal);
    } catch (error) {
      console.log(error);
    }
  };

  // Download file
  const downFile = async (id: string) => {
    const existingFile = files.find((file) => file.id === id);
    if (existingFile?.blobURL) return existingFile.blobURL;
    try {
      const response = await fetch("/api/down_file", {
        method: "POST",
        body: JSON.stringify({ id: id }),
      });
      if (response.status !== 200) {
        const responseJson = await response.json();
        console.log(responseJson);
      } else {
        const arrayBuffer = await response.arrayBuffer();
        const contentType = response.headers.get("Content-Type") || "application/octet-stream";
        const responseBlob = new Blob([arrayBuffer], { type: contentType });
        const responseBlobURL = URL.createObjectURL(responseBlob);
        return responseBlobURL;
      }
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

  // Crop image
  const cropImage = async (id: string, crop: Crop) => {
    try {
      const response = await fetch("/api/crop_file", {
        method: "POST",
        body: JSON.stringify({ id: id, crop: crop }),
      });
      if (response.status !== 200) {
        const responseJson = await response.json();
        console.log(responseJson);
      } else {
        const arrayBuffer = await response.arrayBuffer();
        const contentType = response.headers.get("Content-Type") || "application/octet-stream";
        const responseBlob = new Blob([arrayBuffer], { type: contentType });
        const responseBlobURL = URL.createObjectURL(responseBlob);
        return responseBlobURL;
      }
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  // Get file metadata
  const getFile = async (id: string) => {
    try {
      const response = await fetch("/api/get_file", {
        method: "POST",
        body: JSON.stringify({ id }),
      });
      if (response.status !== 200) {
        const responseJson = await response.json();
        console.log(responseJson);
        return null;
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // Load state from local storage on reload
  useEffect(() => {
    const loadStateFromLocal = async () => {
      try {
        const sessionToken = (await getSession()) as any;
        if (sessionToken) {
          if (sessionToken.error === "RefreshTokenError") login();
          setUser(() => ({ ...sessionToken.user, loggedIn: true }));
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadStateFromLocal();
  }, []);

  // Update the current folder based on page change
  useEffect(() => {
    switch (path) {
      case "/":
        setCurrFolder("home");
        break;
      case "/photos":
        setCurrFolder("photos");
        break;
      case "/docs":
        setCurrFolder("docs");
        break;
      case "/sign":
        setCurrFolder("signatures");
        break;
      default:
        break;
    }
  }, [path]);

  const values: Values = {
    user,
    files,
    logout,
    login,
    listFiles,
    createFile,
    removeFile,
    initUserDirective,
    isOpen,
    onOpen,
    onOpenChange,
    openedFileId,
    setOpenedFileId,
    downFile,
    currImgRef,
    toolbarMode,
    setToolbarMode,
    cropImage,
    getFile,
    currFolder,
    setCurrFolder,
  };

  return <globalContext.Provider value={values}>{children}</globalContext.Provider>;
}

export function useGlobal() {
  return useContext(globalContext);
}

type currFolderType = "home" | "photos" | "docs" | "signatures";
type toolbarModeType = "crop" | "normal" | "cropped";

export interface Values {
  user: Record<string, any>;
  files: Array<fileObj>;
  logout: () => void;
  login: () => void;
  listFiles: () => void;
  createFile: (file: File, folder: string) => void;
  removeFile: (id: string, folder: string) => void;
  initUserDirective: (doListFiles: boolean) => void;
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  openedFileId: string;
  setOpenedFileId: React.Dispatch<React.SetStateAction<string>>;
  downFile: (id: string) => Promise<string | undefined>;
  currImgRef?: React.MutableRefObject<HTMLImageElement | null>;
  toolbarMode: toolbarModeType;
  setToolbarMode: React.Dispatch<React.SetStateAction<toolbarModeType>>;
  cropImage: (id: string, crop: Crop) => Promise<string | undefined>;
  getFile: (id: string) => Promise<any | null>;
  currFolder: currFolderType;
  setCurrFolder: React.Dispatch<React.SetStateAction<currFolderType>>;
}

export type fileObj = {
  name: string;
  id: string;
  mimeType: string;
  parents: string[];
  thumbnailLink: string;
  blobURL: string;
};
