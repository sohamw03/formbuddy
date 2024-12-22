"use client";
import styles from "@/components/MainPanel.module.css";
import { useGlobal } from "@/drivers/GlobalContext";
import { Button } from "@nextui-org/react";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export default function Upload(props: { page: string; isDragging: boolean; setIsDragging: (dragging: boolean) => void }) {
  const { page, isDragging, setIsDragging } = props;
  const { createFile } = useGlobal();

  const uploadRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    return toast.promise(
      new Promise<void>(async (resolve, reject) => {
        try {
          if (file) {
            await createFile(file, page);
            resolve();
          } else {
            reject(new Error("No file selected"));
          }
        } catch (error) {
          reject(error);
        }
      }),
      {
        loading: "Uploading...",
        success: "File uploaded successfully!",
        error: "Failed to upload file.",
      }
    );
  };

  useEffect(() => {
    const handleGlobalDrop = async (e: DragEvent) => {
      e.preventDefault();
      if (page === "home") return;

      const files = e.dataTransfer?.files;
      if (files?.[0]) {
        await handleFileProcess(files[0]);
      }
    };

    window.addEventListener("drop", handleGlobalDrop);
    return () => window.removeEventListener("drop", handleGlobalDrop);
  }, [page]);

  return (
    <Button
      className={`${styles.uploadBtn} ${isDragging ? styles.dragging : ""}`}
      color="default"
      variant="shadow"
      onPress={() => {
        uploadRef.current?.click();
      }}
      onTouchEnd={() => {
        uploadRef.current?.click();
      }}>
      <img src="/icons/plus_icon.svg" width={40} height={40} alt="plus_icon" className={styles.nonInteractive} />
      <input type="file" onChange={(e) => e.target.files?.[0] && handleFileProcess(e.target.files[0])} accept="image/*,application/pdf" multiple={false} ref={uploadRef} />
    </Button>
  );
}
