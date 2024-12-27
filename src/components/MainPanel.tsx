"use client";

import { useGlobal } from "@/drivers/GlobalContext";
import { Spacer, Spinner } from "@nextui-org/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Entity from "./Entity/Entity";
import styles from "./MainPanel.module.css";
import Carousel from "./MainPanel/Carousel";
import Upload from "./Upload";

const folderMap: Record<string, string> = {
  home: "",
  photos: "photos",
  docs: "docs",
  sign: "signatures",
};

export default function MainPanel(props: { page: string }) {
  const { page } = props;
  // Global States
  const { user, initUserDirective, listFiles, isInitialized, setIsInitialized, setNavigationDisabled, initializing, setInitializing } = useGlobal();
  // Local States
  const [isDragging, setIsDragging] = useState(false);

  if (page !== "home" && isInitialized === false) {
    redirect("/");
  }

  useEffect(() => {
    if (user.loggedIn === true) {
      // Check and maintain directory structure; List files if home page
      if (page === "home" && isInitialized === false) {
        initUserDirective(true)
          .then(() => {
            setInitializing(false);
            setIsInitialized(true);
            setNavigationDisabled(false);
          })
          .catch((err) => {
            console.error(err);
            setInitializing(false);
          });
      } else listFiles().then(() => setInitializing(false));
    }
  }, [user]);

  useEffect(() => {
    const handleGlobalDrag = (e: DragEvent) => {
      e.preventDefault();
      if (page !== "home") setIsDragging(true);
    };

    const handleGlobalDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (e.relatedTarget === null) {
        setIsDragging(false);
      }
    };

    const handleGlobalDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    window.addEventListener("dragover", handleGlobalDrag);
    window.addEventListener("dragleave", handleGlobalDragLeave);
    window.addEventListener("drop", handleGlobalDrop);

    return () => {
      window.removeEventListener("dragover", handleGlobalDrag);
      window.removeEventListener("dragleave", handleGlobalDragLeave);
      window.removeEventListener("drop", handleGlobalDrop);
    };
  }, [page]);

  if (initializing) {
    return (
      <div className={styles.main}>
        <Spinner size="lg" label={page === "home" && isInitialized === false ? "Initializing..." : "Loading files..."} className="h-full" />
      </div>
    );
  } else
    return (
      <div className={`${styles.main} ${isDragging && page !== "home" ? styles.dragging : ""}`}>
        {page === "home" ? (
          <>
            <h1 className={styles.heading}>Recents</h1>
            <Carousel title="Photos" folder={"photos"} className={styles.homeCarousel} />
            <Carousel title="Docs" folder={"docs"} className={styles.homeCarousel} />
            <Carousel title="Signatures" folder={"signatures"} className={styles.homeCarousel} />
          </>
        ) : (
          <>
            <Upload page={folderMap[page]} isDragging={isDragging} setIsDragging={setIsDragging} />
            <h1 className={styles.heading}>{page === "sign" ? "Signatures" : `${page.charAt(0).toUpperCase()}${page.slice(1)}`}</h1>
            <Spacer y={4} />
            <Carousel title="" folder={folderMap[page]} />
            <Entity />
          </>
        )}
        {isDragging && page !== "home" && <div className={styles.dragOverlay}>Drop files here</div>}
      </div>
    );
}
