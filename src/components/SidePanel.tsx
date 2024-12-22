"use client";
import { useGlobal } from "@/drivers/GlobalContext";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { Button, Drawer, DrawerContent, DrawerBody, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "./GoogleLoginButton";
import styles from "./SidePanel.module.css";

function SidePanelContent({ onClose }: { onClose?: () => void }) {
  const { user } = useGlobal();
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose?.();
  };

  return (
    <div className={styles.contentWrapper}>
      <h1 className={styles.heading}>
        <Link href={"/"} onClick={() => onClose?.()}>FormBuddy</Link>
      </h1>
      <div className={styles.navWrapper}>
        <Button
          className={styles.button}
          color="default"
          variant="flat"
          onClick={() => handleNavigation("/photos")}>
          Photos
        </Button>
        <Button
          className={styles.button}
          color="default"
          variant="flat"
          onClick={() => handleNavigation("/docs")}>
          Docs
        </Button>
        <Button
          className={styles.button}
          color="default"
          variant="flat"
          onClick={() => handleNavigation("/sign")}>
          Signatures
        </Button>
      </div>
      <div className={styles.gdriveWrapper}>
        {user.loggedIn === false && <GoogleLoginButton />}
      </div>
    </div>
  );
}

export default function SidePanel() {
  const isMobile = useBreakpoint(768); // md breakpoint
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  if (isMobile) {
    return (
      <>
        <Button
          isIconOnly
          className={styles.menuButton}
          onPress={onOpen}
          size="lg"
          variant="flat"
        >
          ☰
        </Button>
        <Drawer
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="left"
          classNames={{
            closeButton: styles.drawerCloseButton
          }}
        >
          <DrawerContent>
            <DrawerBody className={styles.drawerBody}>
              <SidePanelContent onClose={() => onOpenChange()} />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <aside className={styles.main}>
      <SidePanelContent />
    </aside>
  );
}
