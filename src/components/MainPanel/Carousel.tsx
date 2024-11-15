import { useGlobal } from "@/drivers/GlobalContext";
import { Button, Card, CardBody, CardFooter, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image } from "@nextui-org/react";
import styles from "../MainPanel.module.css";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

export default function Carousel(props: { title: string; folder: string }) {
  // Global States
  const { files, removeFile, onOpen, setOpenedFileId, currImgRef, setToolbarMode } = useGlobal();
  // Props
  const { title, folder } = props;

  const path = usePathname();

  // Decide which files to show based on the folder
  const folderData = files.find((file) => file.name === folder);
  const filesToShow = files.filter((file) => folderData?.id === file.parents[0]);
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
                setOpenedFileId(file.id);
                setToolbarMode("normal");
                onOpen();
              }}
              contextMenu="true"
              className={styles.card}>
              <CardBody className={styles.cardBody}>
                <Image shadow="sm" radius="lg" width="100%" alt={file.name} className={styles.image} src={file.thumbnailLink} />
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
                  }
                }}>
                <DropdownItem key="delete" className="text-danger" color="danger">
                  Delete file
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        ))}
      </div>
    </>
  );
}
