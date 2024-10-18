"use client";

import { useGlobal } from "@/drivers/GlobalContext";
import { useEffect } from "react";
import styles from "./MainPanel.module.css";
import Carousel from "./MainPanel/Carousel";
import { Spacer } from "@nextui-org/react";

const folderMap: Record<string, string> = {
  home: "",
  photos: "photos",
  docs: "docs",
  sign: "signatures",
};

export default function MainPanel(props: { page: string }) {
  // Global States
  const { user, files, initUserDirective, createFile } = useGlobal();
  // Props
  const { page } = props;

  useEffect(() => {
    if (user.loggedIn === true) {
      // Check and maintain directory structure
      initUserDirective(folderMap[page]);
    }
  }, [user]);

  switch (page) {
    case "home":
      return (
        <div className={styles.main}>
          <button onClick={() => createFile(folderMap[page])}>CreateFile</button>
          <h1 className={styles.heading}>Recents</h1>
          <Carousel title="Photos" folder={"photos"} />
          <Carousel title="Docs" folder={"docs"} />
          <Carousel title="Signatures" folder={"signatures"} />
        </div>
      );
    case "photos":
      return (
        <div className={styles.main}>
          <h1 className={styles.heading}>Photos</h1>
          <Spacer y={4} />
          <Carousel title="" folder={folderMap[page]} />
        </div>
      );
    case "docs":
      return (
        <div className={styles.main}>
          <h1 className={styles.heading}>Docs</h1>
          <Spacer y={4} />
          <Carousel title="" folder={folderMap[page]} />
        </div>
      );
    case "sign":
      return (
        <div className={styles.main}>
          <h1 className={styles.heading}>Signatures</h1>
          <Spacer y={4} />
          <Carousel title="" folder={folderMap[page]} />
        </div>
      );
  }
}
