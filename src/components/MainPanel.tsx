"use client";

import { useGlobal } from "@/drivers/GlobalContext";
import { Spacer } from "@nextui-org/react";
import { useEffect } from "react";
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
  // Global States
  const { user, initUserDirective, listFiles } = useGlobal();
  // Props
  const { page } = props;

  useEffect(() => {
    if (user.loggedIn === true) {
      // Check and maintain directory structure; List files if home page
      if (page === "home") initUserDirective(true);
      else listFiles();
    }
  }, [user]);

  switch (page) {
    case "home":
      return (
        <div className={styles.main}>
          <h1 className={styles.heading}>Recents</h1>
          <Carousel title="Photos" folder={"photos"} className={styles.homeCarousel} />
          <Carousel title="Docs" folder={"docs"} className={styles.homeCarousel} />
          <Carousel title="Signatures" folder={"signatures"} className={styles.homeCarousel} />
        </div>
      );
    case "photos":
      return (
        <div className={styles.main}>
          <Upload page={folderMap[page]} />
          <h1 className={styles.heading}>Photos</h1>
          <Spacer y={4} />
          <Carousel title="" folder={folderMap[page]} />
          <Entity />
        </div>
      );
    case "docs":
      return (
        <div className={styles.main}>
          <Upload page={folderMap[page]} />
          <h1 className={styles.heading}>Docs</h1>
          <Spacer y={4} />
          <Carousel title="" folder={folderMap[page]} />
          <Entity />
        </div>
      );
    case "sign":
      return (
        <div className={styles.main}>
          <Upload page={folderMap[page]} />
          <h1 className={styles.heading}>Signatures</h1>
          <Spacer y={4} />
          <Carousel title="" folder={folderMap[page]} />
          <Entity />
        </div>
      );
  }
}
