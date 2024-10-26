import { fileObj, useGlobal } from "@/drivers/GlobalContext";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useEffect, useState } from "react";

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
            <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
            <ModalBody>
              {file && <img src={file.blobURL} alt={file.name} style={{ height: "20rem", width: "100%", objectFit: "contain" }} />}
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor quam.</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor quam.</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
