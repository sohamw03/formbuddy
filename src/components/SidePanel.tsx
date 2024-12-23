"use client";
import { useGlobal } from "@/drivers/GlobalContext";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { Button, Drawer, DrawerBody, DrawerContent, useDisclosure } from "@nextui-org/react";
import Image from "next/image";
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
        <Link href={"/"} onClick={() => onClose?.()}>
          FormBuddy
        </Link>
      </h1>
      <div className={styles.navWrapper}>
        <Button className={styles.button} color="default" variant="flat" onPress={() => handleNavigation("/photos")} startContent={<Image src="/icons/photos_icon.svg" alt="Photos" width={14} height={14} />}>
          Photos
        </Button>
        <Button className={styles.button} color="default" variant="flat" onPress={() => handleNavigation("/docs")} startContent={<Image src="/icons/docs_icon.svg" alt="Docs" width={14} height={14} />}>
          Docs
        </Button>
        <Button className={styles.button} color="default" variant="flat" onPress={() => handleNavigation("/sign")} startContent={<Image src="/icons/signature_icon.svg" alt="Signatures" width={14} height={14} />}>
          Signatures
        </Button>
      </div>
      <div className={styles.gdriveWrapper}>{user.loggedIn === false && <GoogleLoginButton />}</div>
    </div>
  );
}

export default function SidePanel() {
  const isMobile = useBreakpoint(768); // md breakpoint
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  if (isMobile) {
    return (
      <>
        <Button isIconOnly className={styles.menuButton} onPress={onOpen} size="lg" variant="flat">
          ☰
        </Button>
        <Drawer
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="left"
          classNames={{
            closeButton: styles.drawerCloseButton,
          }}>
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
