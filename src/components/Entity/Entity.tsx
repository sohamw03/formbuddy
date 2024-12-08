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
  const [resolution, setResolution] = useState({ width: 0, height: 0 });
  // Crop plugin states
  const [crop, setCrop] = useState<Crop>();
  const [percentCrop, setPercentCrop] = useState<Crop>();

  // Get the file to show
  const getFileToShow = () => {
    let fileToShow: fileObj | undefined;
    files.forEach((file) => {
      file.children?.forEach((child) => {
        if (child.id === openedFileId) {
          fileToShow = child;
        }
      });
    });
    if (!fileToShow) {
      fileToShow = files.find((file) => file.id === openedFileId);
    }
    return fileToShow;
  };
  const [file, setFile] = useState<fileObj | undefined>();
  useEffect(() => {
    setFile(getFileToShow());
  }, [openedFileId, files]);
  // const [file, setFile] = useState<fileObj | undefined>({ name: "image.jpg", blobURL: "https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg", id: "cgsciac", mimeType: "image/jpg", parents: [""], thumbnailLink: "", variants: [] });

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
                // 64rem x 35rem
                const calcImgStyle = resolution.width / resolution.height > 64 / 35 ? styles.image : styles.imageVert;
                switch (toolbarMode) {
                  case "normal":
                    return <ModalBody className={styles.modalBody}>{file && <img src={file.blobURL} alt={file.name} className={calcImgStyle} ref={currImgRef} onLoad={extractResolution} />}</ModalBody>;
                  case "crop":
                    return <CropPlugin isOpen={true} src={file.blobURL} crop={crop} setCrop={setCrop} percentCrop={percentCrop} setPercentCrop={setPercentCrop} calcImgStyle={calcImgStyle} />;
                  case "cropped":
                    return <ModalBody className={styles.modalBody}>{file && <img src={file.blobURL} alt={file.name} className={calcImgStyle} ref={currImgRef} onLoad={extractResolution} />}</ModalBody>;
                  case "qualled":
                    return <ModalBody className={styles.modalBody}>{file && <img src={file.blobURL} alt={file.name} className={calcImgStyle} ref={currImgRef} />}</ModalBody>;
                }
              })()}
              <Toolbar resolution={resolution} crop={crop} percentCrop={percentCrop} fileState={{ file, setFile }} />
            </>
          )}
        </ModalContent>
      </Modal>
    );
}
