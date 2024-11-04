import { fileObj, useGlobal } from "@/drivers/GlobalContext";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useEffect, useState } from "react";
import styles from "./Entity.module.css";
import Toolbar from "./Toolbar/Toolbar";
import CropPlugin from "./Toolbar/CropPlugin";

export default function Entity() {
  // Global context
  const { isOpen, onOpenChange, files, openedFileId, currImgRef, cropOpen } = useGlobal();
  // Local state
  // const [file, setFile] = useState<fileObj | undefined>(files.find((file) => file.id === openedFileId));
  const [file, setFile] = useState<fileObj | undefined>({ name: "image.jpg", blobURL: "https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg", id: "cgsciac", mimeType: "image/jpg", parents: [""], thumbnailLink: "" });
  const [resolution, setResolution] = useState({ width: 0, height: 0 });

  // useEffect(() => {
  //   setFile(files.find((file) => file.id === openedFileId));
  // }, [openedFileId, files]);

  // Extract resolution of the image when it is loaded
  const extractResolution = () => {
    if (currImgRef?.current) setResolution({ width: currImgRef.current.naturalWidth, height: currImgRef.current.naturalHeight });
  };

  if (file)
    return (
      <Modal isOpen={true} placement="top-center" onOpenChange={onOpenChange} size="5xl" scrollBehavior="inside" backdrop="blur">
        <ModalContent className="relative">
          {(onClose) => (
            <>
              <ModalHeader className={styles.header}>{file.name}</ModalHeader>
              {!cropOpen && <ModalBody className={styles.modalBody}>{file && <img src={file.blobURL} alt={file.name} className={styles.image} ref={currImgRef} onLoad={extractResolution} />}</ModalBody>}
              <CropPlugin isOpen={cropOpen} src={file.blobURL} />
              <Toolbar resolution={resolution} />
            </>
          )}
        </ModalContent>
      </Modal>
    );
}
