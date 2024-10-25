import { fileObj, useGlobal } from "@/drivers/GlobalContext";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useEffect } from "react";

export default function Entity() {
  // Global context
  const { isOpen, onOpenChange, files, openedFileId } = useGlobal();
  let currentFileObj: fileObj | undefined;
  let currentFileBlob: Blob | undefined;
  useEffect(() => {
    currentFileObj = files.find((file) => file.id === openedFileId);
    console.log(currentFileObj);
  }, [openedFileId]);

  return (
    <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange} size="4xl" scrollBehavior="inside" backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
            <ModalBody>
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
