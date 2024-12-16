import { fileObj, useGlobal } from "@/drivers/GlobalContext";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { type Crop } from "react-image-crop";
import styles from "./Entity.module.css";
import CropPlugin from "./Toolbar/CropPlugin";
import Toolbar from "./Toolbar/Toolbar";
import { pdfjs } from 'react-pdf';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

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
  const [pageNumber, setPageNumber] = useState<number>(1);

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

                // Check if file is PDF
                if (file.mimeType === "application/pdf") {
                  console.log(file);
                  return (
                    <ModalBody className={styles.modalBody}>
                      <Document
                        file={file.blobURL}
                        onLoadSuccess={onDocumentLoadSuccess}
                        className={styles.pdfDocument}
                      >
                        <Page
                          pageNumber={pageNumber}
                          className={styles.pdfPage}
                          renderTextLayer={false}
                        />
                      </Document>
                      {numPages && (
                        <div className={styles.pdfControls}>
                          <button
                            onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                            disabled={pageNumber <= 1}
                          >
                            Previous
                          </button>
                          <span>Page {pageNumber} of {numPages}</span>
                          <button
                            onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
                            disabled={pageNumber >= numPages}
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </ModalBody>
                  );
                }

                // Existing image handling
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
