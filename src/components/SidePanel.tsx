"use client";
import { useGlobal } from "@/drivers/GlobalContext";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import GoogleLoginButton from "./GoogleLoginButton";
import styles from "./SidePanel.module.css";
import { useRouter } from "next/navigation";

export default function SidePanel() {
  const { user } = useGlobal();
  const router = useRouter();
  return (
    <aside className={styles.main}>
      <h1 className={styles.heading}>
        <Link href={"/"}>FormBuddy</Link>
      </h1>
      <div className={styles.navWrapper}>
        <Button className={styles.button} color="default" variant="flat" onClick={() => {router.push("/photos")}}>
          Photos
        </Button>
        <Button className={styles.button} color="default" variant="flat" onClick={() => {router.push("/docs")}}>
          Docs
        </Button>
        <Button className={styles.button} color="default" variant="flat" onClick={() => {router.push("/sign")}}>
          Signatures
        </Button>
      </div>
      <div className={styles.gdriveWrapper}>{user.loggedIn === false && <GoogleLoginButton />}</div>
    </aside>
  );
}
