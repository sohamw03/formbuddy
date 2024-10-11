"use client";

import { useGlobal } from "@/drivers/GlobalContext";
import { useEffect } from "react";
import styles from "./MainPanel.module.css";
import Carousel from "./MainPanel/Carousel";

export default function MainPanel(props: { page: string }) {
  // Global States
  const { listFiles, createFile, removeFile, user, files } = useGlobal();
  // Props
  const { page } = props;

  const fetchFiles = async () => {
    listFiles();
  };
  useEffect(() => {
    if (user.loggedIn === true) {
      fetchFiles();
    }
  }, [user]);

  switch (page) {
    case "home":
      return (
        <div className={styles.main}>
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
