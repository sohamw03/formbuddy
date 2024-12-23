"use client";
import { fileObj, useGlobal } from "@/drivers/GlobalContext";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { type Crop } from "react-image-crop";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import styles from "./Entity.module.css";
import CropPlugin from "./Toolbar/CropPlugin";
import Toolbar from "./Toolbar/Toolbar";

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function Entity() {
  // Global context
  const { isOpen, onOpenChange, files, openedFileId, currImgRef, toolbarMode } = useGlobal();
  const [resolution, setResolution] = useState({ width: 0, height: 0 });
  // Crop plugin states
  const [crop, setCrop] = useState<Crop>();
  const [percentCrop, setPercentCrop] = useState<Crop>();
  const [numPages, setNumPages] = useState<number>();

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

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

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

                // Existing image handling
                switch (toolbarMode) {
                  case "normal":
                    // Check if file is PDF
                    if (file.mimeType === "application/pdf") {
                      return (
                        <ModalBody className={styles.modalBody}>
                          <Document file={file.blobURL} onLoadSuccess={onDocumentLoadSuccess} className={styles.pdfDocument}>
                            {Array.from(new Array(numPages), (_, index) => (
                              <Page key={`page_${index + 1}`} pageNumber={index + 1} className={styles.pdfPage} renderTextLayer={false} />
                            ))}
                          </Document>
                        </ModalBody>
                      );
                    }
                    return (
                      <ModalBody className={styles.modalBody}>
                        {file && (
                          <TransformWrapper smooth={true} doubleClick={{ mode: "toggle" }}>
                            <TransformComponent wrapperStyle={{cursor: "grab"}}>
                              <img src={file.blobURL} alt={file.name} className={calcImgStyle} ref={currImgRef} onLoad={extractResolution} />
                            </TransformComponent>
                          </TransformWrapper>
                        )}
                      </ModalBody>
                    );
                  case "crop":
                    return <CropPlugin isOpen={true} src={file.blobURL} crop={crop} setCrop={setCrop} percentCrop={percentCrop} setPercentCrop={setPercentCrop} calcImgStyle={calcImgStyle} />;
                  case "cropped":
                    return (
                      <ModalBody className={styles.modalBody}>
                        {file && (
                          <TransformWrapper smooth={true} doubleClick={{ mode: "toggle" }}>
                            <TransformComponent wrapperStyle={{cursor: "grab"}}>
                              <img src={file.blobURL} alt={file.name} className={calcImgStyle} ref={currImgRef} onLoad={extractResolution} />
                            </TransformComponent>
                          </TransformWrapper>
                        )}
                      </ModalBody>
                    );
                  case "qualled":
                    // Check if file is PDF
                    if (file.mimeType === "application/pdf") {
                      return (
                        <ModalBody className={styles.modalBody}>
                          <Document file={file.blobURL} onLoadSuccess={onDocumentLoadSuccess} className={styles.pdfDocument}>
                            {Array.from(new Array(numPages), (_, index) => (
                              <Page key={`page_${index + 1}`} pageNumber={index + 1} className={styles.pdfPage} renderTextLayer={false} />
                            ))}
                          </Document>
                        </ModalBody>
                      );
                    }
                    return (
                      <ModalBody className={styles.modalBody}>
                        {file && (
                          <TransformWrapper smooth={true} doubleClick={{ mode: "toggle" }}>
                            <TransformComponent wrapperStyle={{cursor: "grab"}}>
                              <img src={file.blobURL} alt={file.name} className={calcImgStyle} ref={currImgRef} />
                            </TransformComponent>
                          </TransformWrapper>
                        )}
                      </ModalBody>
                    );
                }
              })()}
              <Toolbar resolution={resolution} crop={crop} percentCrop={percentCrop} fileState={{ file, setFile }} />
            </>
          )}
        </ModalContent>
      </Modal>
    );
}
