"use client";

import { useGlobal } from "@/drivers/GlobalContext";
import { Card, CardFooter, Image, Button, CardBody } from "@nextui-org/react";
import { useEffect } from "react";
import styles from "./MainPanel.module.css";

export default function MainPanel(props: any) {
  // Global States
  const { listFiles, createFile, removeFile, user, files } = useGlobal();

  const fetchFiles = async () => {
    listFiles();
  };
  useEffect(() => {
    if (user.loggedIn === true) {
      fetchFiles();
    }
  }, [user]);
  return (
    <div className={styles.main}>
      <h1 className={styles.heading}>Recents</h1>
      <h2 className={styles.heading2}>Photos</h2>
      <div className={styles.cardWrapper}>
        {files.map((file) => (
          <Card shadow="sm" key={file.id} isPressable onPress={() => console.log("item pressed")} contextMenu="true">
            <CardBody className={styles.cardBody}>
              <Image shadow="sm" radius="lg" width="100%" alt={""} className={styles.image} src={"https://placehold.co/600x400"} />
            </CardBody>
            <CardFooter className={styles.cardFooter}>
              <b>{file.name}</b>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
