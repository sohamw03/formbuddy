"use client";
import { useGlobal } from "@/drivers/GlobalContext";
import { Button, Card, CardBody, CardFooter, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, DropdownSection } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import styles from "../MainPanel.module.css";
import { useEffect, useState } from "react";

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
  const folderData = files.find((file) => file.name === folder);
  const filesToShow = files.filter((file) => folderData?.id === file.parents[0]);

  useEffect(() => {
    // Create an object with original variants for all files
    const initialVariants: Record<string, string> = {};
    filesToShow.forEach((file) => {
      initialVariants[file.id] = ""; // empty string represents original variant
    });
    setSelectedVariants(initialVariants);
  }, []);

  return (
    <>
      {title !== "" && <h2 className={styles.heading2}>{title}</h2>}
      <div className={styles.cardWrapper}>
        {filesToShow.map((file) => (
          <div key={file.id} className="relative">
            <Card
              shadow="sm"
              isPressable
              onPress={() => {
                if (path === "/") return;
                setOpenedFileId(selectedVariants[file.id] || file.id);
                setToolbarMode("normal");
                onOpen();
              }}
              contextMenu="true"
              className={styles.card}>
              <CardBody className={styles.cardBody}>
                <Image shadow="sm" radius="lg" width="100%" alt={file.name} className={styles.image} src={selectedVariants[file.id] ? files.find((f) => f.id === selectedVariants[file.id])?.thumbnailLink || file.thumbnailLink : file.thumbnailLink} />
              </CardBody>
              <CardFooter className={styles.cardFooter}>
                <abbr title={file.name} className="whitespace-nowrap overflow-hidden no-underline">
                  <b>{file.name}</b>
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
                  if (key === "delete") {
                    toast.promise(removeFile(file.id, folder), {
                      loading: "Deleting...",
                      success: "Deleted!",
                      error: "Failed to delete",
                    });
                  } else if (typeof key === "string" && key.startsWith("variant_")) {
                    const variantId = key.replace("variant_", "");
                    setSelectedVariants((prev) => ({
                      ...prev,
                      [file.id]: variantId === "original" ? "" : variantId,
                    }));
                  }
                }}>
                <DropdownSection title="Resolutions">
                  <DropdownItem key="variant_original" className={!selectedVariants[file.id] ? "text-primary" : ""}>
                    Original
                  </DropdownItem>
                  <>
                    {file.children?.map((variant) => {
                      return (
                        <DropdownItem key={`variant_${variant.id}`} className={selectedVariants[file.id] === variant.id ? "text-blue-300" : ""}>
                          {getResolution(variant.name)}
                        </DropdownItem>
                      );
                    })}
                  </>
                </DropdownSection>
                <DropdownSection>
                  <DropdownItem key="delete" className="text-danger" color="danger">
                    Delete file
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          </div>
        ))}
      </div>
    </>
  );
}
