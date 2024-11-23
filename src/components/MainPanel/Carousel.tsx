"use client";
import { fileObj, useGlobal } from "@/drivers/GlobalContext";
import { Button, Card, CardBody, CardFooter, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Image } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styles from "../MainPanel.module.css";

// Utility function to extract resolution from filename
const getResolution = (filename: string) => {
  const match = filename.match(/_r_(\d+x\d+)/);
  return match ? match[1].replace("x", " x ") : "Original";
};

export default function Carousel(props: { title: string; folder: string }) {
  // Global States
  const { files, removeFile, onOpen, setOpenedFileId, setToolbarMode } = useGlobal();
  // Props
  const { title, folder } = props;

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

  return (
    <>
      {title !== "" && <h2 className={styles.heading2}>{title}</h2>}
      <div className={styles.cardWrapper}>
        {filesToShow.map((file) => {
          const fileVariant = file.children?.find((f) => f.id === selectedVariants[file.id]) as fileObj || file;
          return (
            <div key={file.id} className="relative">
              <Card
                shadow="sm"
                isPressable
                onPress={() => {
                  if (path === "/") return;
                  setOpenedFileId(fileVariant.id);
                  setToolbarMode("normal");
                  onOpen();
                }}
                className={styles.card}>
                <CardBody className={styles.cardBody}>
                  <Image shadow="sm" radius="lg" width="100%" alt={fileVariant.name} className={styles.image} src={fileVariant.thumbnailLink} />
                </CardBody>
                <CardFooter className={styles.cardFooter}>
                  <abbr title={fileVariant.name} className="whitespace-nowrap overflow-hidden no-underline">
                    <b>{fileVariant.name}</b>
                  </abbr>
                </CardFooter>
              </Card>
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
                    }
                  }}>
                  <DropdownSection title={undefined} items={[{ id: file.id, name: "Original" }].concat(file.children as Array<any>)}>
                    {(variant) => (
                      <DropdownItem key={`variant_${variant.id}`} className={selectedVariants[file.id] === variant.id ? "text-primary-300" : ""}>
                        {getResolution(variant.name)}
                      </DropdownItem>
                    )}
                  </DropdownSection>
                  <DropdownSection title={undefined}>
                    <DropdownItem key="delete" className="text-danger" color="danger">
                      Delete file
                    </DropdownItem>
                  </DropdownSection>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        })}
      </div>
    </>
  );
}
