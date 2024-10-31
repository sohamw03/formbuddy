import { fileObj, useGlobal } from "@/drivers/GlobalContext";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useEffect, useState } from "react";
import styles from "./Entity.module.css";
import Toolbar from "./Toolbar/Toolbar";

export default function Entity() {
  // Global context
  const { isOpen, onOpenChange, files, openedFileId } = useGlobal();
  // Local state
  const [file, setFile] = useState<fileObj | undefined>(files.find((file) => file.id === openedFileId));
  useEffect(() => {
    setFile(files.find((file) => file.id === openedFileId));
  }, [openedFileId, files]);

  return (
    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} size="5xl" scrollBehavior="inside" backdrop="blur">
      <ModalContent className="relative">
        {(onClose) => (
          <>
            <ModalHeader className={styles.header}>{file?.name}</ModalHeader>
            <ModalBody className={styles.modalBody}>{file && <img src={file.blobURL} alt={file.name} className={styles.image} />}</ModalBody>
            <Toolbar />
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
