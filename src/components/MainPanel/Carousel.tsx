"use client";
import { fileObj, useGlobal } from "@/drivers/GlobalContext";
import { Button, Card, CardBody, CardFooter, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Image } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styles from "../MainPanel.module.css";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Utility function to extract resolution from filename
const getResolution = (filename: string) => {
  const match = filename.match(/_r_(\d+x\d+)/);
  return match ? match[1].replace("x", " x ") : "Original";
};

// Add this utility function next to getResolution
const getQuality = (filename: string) => {
  const match = filename.match(/_q_(\d+)/);
  return match ? `${match[1]}% Quality` : "Original";
};

function PDFThumbnail({ file }: { file: fileObj }) {
  return (
    <div className={styles.pdfWrapper}>
      <Document file={file.blobURL}>
        <Page pageNumber={1} width={300} height={220} renderTextLayer={false} renderAnnotationLayer={false} />
      </Document>
    </div>
  );
}

export default function Carousel(props: { title: string; folder: string; className?: string }) {
  // Global States
  const { files, removeFile, onOpen, setOpenedFileId, setToolbarMode } = useGlobal();
  // Props
  const { title, folder, className } = props;

  const path = usePathname();
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  // Decide which files to show based on the folder
  const [filesToShow, setFilesToShow] = useState(() => {
    const folderData = files.find((file) => file.name === folder);
    return files.filter((file) => folderData?.id === file.parents[0]);
  });
  useEffect(() => {
    const folderData = files.find((file) => file.name === folder);
    setFilesToShow(files.filter((file) => folderData?.id === file.parents[0]));
  }, [folder, files]);

  useEffect(() => {
    // Create an object with original variants for all files
    const initialVariants: Record<string, string> = {};
    filesToShow.forEach((file) => {
      initialVariants[file.id] = file.id;
    });
    setSelectedVariants(initialVariants);
  }, [filesToShow]);

  const handleCopy = async (file: fileObj) => {
    try {
      if (await navigator.permissions.query({ name: "clipboard-write" as any }).then((result) => result.state === "granted")) {
        const response = await fetch(file.blobURL);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({
            [file.mimeType]: blob,
          }),
        ]);
        toast.success("Copied to clipboard!");
      } else throw new Error("Clipboard permission denied");
    } catch (error) {
      toast.error(`Failed to copy. [${error}]`);
      console.error(error);
    }
  };

  return (
    <>
      {title !== "" && <h2 className={styles.heading2}>{title}</h2>}
      <div className={`${styles.cardWrapper} ${className || ""}`}>
        {filesToShow.map((file) => {
          const fileVariant = (file.children?.find((f) => f.id === selectedVariants[file.id]) as fileObj) || file;
          const resolutionVariants = file.children?.filter((c) => c.name.includes("_r_")) || [];
          const qualityVariants = file.children?.filter((c) => c.name.includes("_q_")) || [];
          return (
            <div key={file.id} className="relative">
              <Button
                variant="shadow"
                className={styles.copyBtn}
                onPress={(e) => {
                  handleCopy(fileVariant);
                }}
              >
                <img className={styles.nonInteractive} src="/icons/copy_icon.svg" alt="copy" />
              </Button>
              <Card
                shadow="sm"
                isPressable
                onPress={() => {
                  if (path === "/") return;
                  setOpenedFileId(fileVariant.id);
                  setToolbarMode("normal");
                  onOpen();
                }}
                className={styles.card}
              >
                <CardBody className={styles.cardBody}>
                  {fileVariant.mimeType === "application/pdf" ? (
                    <PDFThumbnail file={fileVariant} />
                  ) : (
                    <Image
                      shadow="sm"
                      radius="lg"
                      width="100%"
                      alt={fileVariant.name}
                      className={`${styles.image} pointer-events-none`}
                      src={fileVariant.thumbnailLink}
                    />
                  )}
                </CardBody>
                <CardFooter className={styles.cardFooter}>
                  <abbr title={fileVariant.name} className="whitespace-nowrap overflow-hidden no-underline">
                    <b>{fileVariant.name}</b>
                  </abbr>
                </CardFooter>
              </Card>

              {/* Dropdown */}
              <Dropdown placement="bottom-start">
                <DropdownTrigger>
                  <Button variant="shadow" className={styles.dropDownBtn}>
                    <img src="/icons/more_vert.svg" alt="more_vert" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Dropdown menu"
                  onAction={(key) => {
                    const keyStr = String(key);
                    if (keyStr === "delete") {
                      toast.promise(removeFile(fileVariant.id, folder), {
                        loading: "Deleting...",
                        success: "Deleted!",
                        error: "Failed to delete",
                      });
                    } else if (keyStr.startsWith("variant_")) {
                      const variantId = keyStr.replace("variant_", "");
                      setSelectedVariants((prev) => ({
                        ...prev,
                        [file.id]: variantId,
                      }));
                    } else if (keyStr === "download") {
                      const a = document.createElement("a");
                      a.href = fileVariant.blobURL;
                      a.download = fileVariant.name;
                      a.click();
                    }
                  }}
                >
                  <DropdownItem key="download" startContent={<Image src="/icons/download_icon.svg" alt="Photos" width={20} height={20} />}>
                    Download
                  </DropdownItem>
                  <DropdownItem
                    key={`variant_${file.id}`}
                    className={selectedVariants[file.id] === file.id ? "text-primary-300" : ""}
                    showDivider={!resolutionVariants.length && !qualityVariants.length}
                  >
                    Original
                  </DropdownItem>
                  {!!resolutionVariants.length ? (
                    <DropdownSection title="Resolution Variants" items={resolutionVariants} showDivider={!qualityVariants.length}>
                      {(variant) => (
                        <DropdownItem key={`variant_${variant.id}`} className={selectedVariants[file.id] === variant.id ? "text-primary-300" : ""}>
                          {getResolution(variant.name)}
                        </DropdownItem>
                      )}
                    </DropdownSection>
                  ) : null}
                  {!!qualityVariants.length ? (
                    <DropdownSection title="Quality Variants" items={qualityVariants} showDivider>
                      {(variant) => (
                        <DropdownItem key={`variant_${variant.id}`} className={selectedVariants[file.id] === variant.id ? "text-primary-300" : ""}>
                          {getQuality(variant.name)}
                        </DropdownItem>
                      )}
                    </DropdownSection>
                  ) : null}
                  <DropdownItem key="delete" className="text-danger" color="danger">
                    Delete file
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        })}
      </div>
    </>
  );
}
