import { fileObj, useGlobal } from "@/drivers/GlobalContext";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { type Crop } from "react-image-crop";
import styles from "./Entity.module.css";
import CropPlugin from "./Toolbar/CropPlugin";
import Toolbar from "./Toolbar/Toolbar";

export default function Entity() {
  // Global context
  const { isOpen, onOpenChange, files, openedFileId, currImgRef, toolbarMode } = useGlobal();
  // Local state
  const [file, setFile] = useState<fileObj | undefined>(files.find((file) => file.id === openedFileId));
  // const [file, setFile] = useState<fileObj | undefined>({ name: "image.jpg", blobURL: "https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg", id: "cgsciac", mimeType: "image/jpg", parents: [""], thumbnailLink: "" });
  const [resolution, setResolution] = useState({ width: 0, height: 0 });
  // Crop plugin states
  const [crop, setCrop] = useState<Crop>();
  const [percentCrop, setPercentCrop] = useState<Crop>();

  useEffect(() => {
    setFile(files.find((file) => file.id === openedFileId));
  }, [openedFileId, files]);

  // Extract resolution of the image when it is loaded
  const extractResolution = () => {
    if (currImgRef?.current) setResolution({ width: currImgRef.current.naturalWidth, height: currImgRef.current.naturalHeight });
  };

  if (file)
    return (
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} size="5xl" scrollBehavior="inside" backdrop="blur">
        <ModalContent className="relative">
          {(onClose) => (
            <>
              <ModalHeader className={styles.header}>{file.name}</ModalHeader>
              {(() => {
                switch (toolbarMode) {
                  case "normal":
                    return <ModalBody className={styles.modalBody}>{file && <img src={file.blobURL} alt={file.name} className={styles.image} ref={currImgRef} onLoad={extractResolution} />}</ModalBody>;
                  case "crop":
                    return <CropPlugin isOpen={true} src={file.blobURL} crop={crop} setCrop={setCrop} percentCrop={percentCrop} setPercentCrop={setPercentCrop} />;
                }
              })()}
              <Toolbar resolution={resolution} crop={crop} percentCrop={percentCrop} fileState={{ file, setFile }} />
            </>
          )}
        </ModalContent>
      </Modal>
    );
}
