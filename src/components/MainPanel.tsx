"use client";

import { useGlobal } from "@/drivers/GlobalContext";
import { useEffect } from "react";
import styles from "./MainPanel.module.css";
import Carousel from "./MainPanel/Carousel";

export default function MainPanel(props: { page: string }) {
  // Global States
  const { user, files, initUserDirective, createFile } = useGlobal();
  // Props
  const { page } = props;

  useEffect(() => {
    if (user.loggedIn === true) {
      // Check and maintain directory structure
      initUserDirective();
    }
  }, [user]);

  switch (page) {
    case "home":
      return (
        <div className={styles.main}>
          <button onClick={createFile}>CreateFile</button>
          <h1 className={styles.heading}>Recents</h1>
          <Carousel title="Photos" />
          <Carousel title="Docs" />
          <Carousel title="Signatures" />
        </div>
      );
    case "photos":
      return;
    case "docs":
      return;
    case "sign":
      return;
  }
}
