"use client";
import { useGlobal } from "@/drivers/GlobalContext";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import GoogleLoginButton from "./GoogleLoginButton";
import styles from "./SidePanel.module.css";

export default function SidePanel() {
  const { user } = useGlobal();
  return (
    <aside className={styles.main}>
      <h1 className={styles.heading}>
        <Link href={"/"}>FormBuddy</Link>
      </h1>
      <div className={styles.navWrapper}>
        <Link href={"/photos"}>
          <Button className={styles.button} color="default" variant="flat">
            Photos
          </Button>
        </Link>
        <Link href={"/docs"}>
          <Button className={styles.button} color="default" variant="flat">
            Docs
          </Button>
        </Link>
        <Link href={"/sign"}>
          <Button className={styles.button} color="default" variant="flat">
            Signatures
          </Button>
        </Link>
      </div>
      <div className={styles.gdriveWrapper}>{user.loggedIn === false && <GoogleLoginButton />}</div>
    </aside>
  );
}
