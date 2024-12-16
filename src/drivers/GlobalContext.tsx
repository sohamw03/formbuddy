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
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  // Toolbar states
  const [toolbarMode, setToolbarMode] = useState<toolbarModeType>("normal");

  const path = usePathname();

  // Auth logout
  const logout = () => {
    try {
      // Sign out from next-auth
      signOut();
      setUser(() => ({ loggedIn: false }));
      setFiles([]);
    } catch (error) {
      console.error(error);
    }
  };

  // Auth login
  const login = async (): Promise<void> => {
    try {
      const result = await signIn("google", { redirect: false, callbackUrl: "/" });
      if (result?.error) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Maintain directory structure
  const initUserDirective = async (doListFiles: boolean): Promise<void> => {
    try {
      const response = await fetch("/api/init_user", { method: "POST" });
      const responseJson = await response.json();
      console.log(responseJson);

      if (doListFiles) {
        await listFiles();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // List all files
  const listFiles = async (): Promise<void> => {
    try {
      const response = await fetch("/api/list_files", {
        method: "POST",
      });
      const responseJson = await response.json();
      let filesLocal = (await Promise.all(
        responseJson.files.map(async (file: fileObj) => ({
          name: file.name,
          id: file.id,
          mimeType: file.mimeType,
          parents: file.parents,
          thumbnailLink: file.thumbnailLink,
          blobURL: `${file.mimeType.includes("image") || file.mimeType === "application/pdf"
             ? await downFile(file.id) : ""}`,
          resolutionVariants: file.resolutionVariants,
          qualityVariants: file.qualityVariants,
        }))
      )) as fileObj[];

      // Create a tree structure for the files
      let fileObjsToDelete: string[] = [];
      filesLocal.map((file) => {
        if (file.resolutionVariants.length > 0 || file.qualityVariants.length > 0) {
          file.children = file.resolutionVariants.concat(file.qualityVariants).map((variant) => {
            const variantObj = filesLocal.find((file) => file.id === variant);
            return variantObj as fileObj;
          });
          fileObjsToDelete.push(...file.resolutionVariants, ...file.qualityVariants);
        }
      });
      // Remove the variants from the main files array
      filesLocal = filesLocal.filter((file) => !fileObjsToDelete.includes(file.id));

      console.log({ filesLocal });
      setFiles(filesLocal);
    } catch (error) {
      console.error(error);
    }
  };

  // Download file
  const downFile = async (id: string): Promise<string | undefined> => {
    const existingFile = files.find((file) => file.id === id || file.resolutionVariants.includes(id) || file.qualityVariants.includes(id));
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
  const createFile = async (file: File, folder: string, options?: FileVariantOptions): Promise<void> => {
    try {
      const payload = new FormData();
      payload.append("name", file.name);
      payload.append("content", file);
      payload.append("folder_id", `${files.find((file) => file.name === folder && file.mimeType === "application/vnd.google-apps.folder")?.id}`);
      payload.append("is_reso_variant", `${!!options?.isResolutionVariant}`);
      payload.append("is_qual_variant", `${!!options?.isQualityVariant}`);
      if (options?.quality) {
        payload.append("quality", `${options.quality}`);
      }
      const response = await fetch("/api/create_file", {
        method: "POST",
        body: payload,
      });
      const responseJson = await response.json();
      console.log(responseJson);
      await listFiles();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // Remove file
  const removeFile = async (id: string, folder: string): Promise<void> => {
    try {
      const response = await fetch("/api/remove_file", {
        method: "POST",
        body: JSON.stringify({ id: id }),
      });
      const responseJson = await response.json();
      console.log(responseJson);
      await listFiles();
    } catch (error) {
      console.error(error);
    }
  };

  // Crop image
  const cropImage = async (id: string, crop: Crop): Promise<string> => {
    try {
      const response = await fetch("/api/crop_file", {
        method: "POST",
        body: JSON.stringify({ id: id, crop: crop }),
      });
      if (response.status !== 200) {
        const responseJson = await response.json();
        console.error(responseJson);
        throw new Error(responseJson);
      }
      const arrayBuffer = await response.arrayBuffer();
      const contentType = response.headers.get("Content-Type") || "application/octet-stream";
      const responseBlob = new Blob([arrayBuffer], { type: contentType });
      return URL.createObjectURL(responseBlob);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Quality image
  const qualImage = async (id: string, quality: number): Promise<string> => {
    try {
      const response = await fetch("/api/quality_file", {
        method: "POST",
        body: JSON.stringify({ id: id, quality: quality }),
      });
      if (response.status !== 200) {
        const responseJson = await response.json();
        console.error(responseJson);
        throw new Error(responseJson);
      }
      const arrayBuffer = await response.arrayBuffer();
      const contentType = response.headers.get("Content-Type") || "application/octet-stream";
      const responseBlob = new Blob([arrayBuffer], { type: contentType });
      return URL.createObjectURL(responseBlob);
    } catch (error) {
      console.error(error);
      throw error;
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
    onClose,
    openedFileId,
    setOpenedFileId,
    downFile,
    currImgRef,
    toolbarMode,
    setToolbarMode,
    cropImage,
    currFolder,
    setCurrFolder,
    qualImage,
  };

  return <globalContext.Provider value={values}>{children}</globalContext.Provider>;
}

export function useGlobal() {
  return useContext(globalContext);
}

type currFolderType = "home" | "photos" | "docs" | "signatures";
type toolbarModeType = "crop" | "normal" | "cropped" | "qualled";

export interface FileVariantOptions {
  isResolutionVariant?: boolean;
  isQualityVariant?: boolean;
  quality?: number;
}

export interface Values {
  user: Record<string, any>;
  files: Array<fileObj>;
  logout: () => void;
  login: () => Promise<void>;
  listFiles: () => Promise<void>;
  createFile: (file: File, folder: string, options?: FileVariantOptions) => Promise<void>;
  removeFile: (id: string, folder: string) => Promise<void>;
  initUserDirective: (doListFiles: boolean) => Promise<void>;
  downFile: (id: string) => Promise<string | undefined>;
  cropImage: (id: string, crop: Crop) => Promise<string>;
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  onClose: () => void;
  openedFileId: string;
  setOpenedFileId: React.Dispatch<React.SetStateAction<string>>;
  currImgRef?: React.MutableRefObject<HTMLImageElement | null>;
  toolbarMode: toolbarModeType;
  setToolbarMode: React.Dispatch<React.SetStateAction<toolbarModeType>>;
  currFolder: currFolderType;
  setCurrFolder: React.Dispatch<React.SetStateAction<currFolderType>>;
  qualImage: (id: string, quality: number) => Promise<string>;
}

export type fileObj = {
  name: string;
  id: string;
  mimeType: string;
  parents: string[];
  thumbnailLink: string;
  blobURL: string;
  resolutionVariants: string[];
  qualityVariants: string[];
  children?: fileObj[];
};
