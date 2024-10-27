import { fileObj, useGlobal } from "@/drivers/GlobalContext";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useEffect, useState } from "react";
import styles from "./Entity.module.css";

export default function Entity() {
  // Global context
  const { isOpen, onOpenChange, files, openedFileId } = useGlobal();
  // Local state
  const [file, setFile] = useState<fileObj | undefined>(files.find((file) => file.id === openedFileId));
  useEffect(() => {
    setFile(files.find((file) => file.id === openedFileId));
  }, [openedFileId, files]);

  return (
    <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange} size="4xl" scrollBehavior="inside" backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{file?.name}</ModalHeader>
            <ModalBody>{file && <img src={file.blobURL} alt={file.name} className={styles.image} />}</ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
