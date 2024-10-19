import { useGlobal } from "@/drivers/GlobalContext";
import styles from "../MainPanel.module.css";
import { Button, Card, CardBody, CardFooter, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image } from "@nextui-org/react";

export default function Carousel(props: { title: string; folder: string }) {
  // Global States
  const { files, removeFile } = useGlobal();
  // Props
  const { title, folder } = props;

  // Decide which files to show based on the folder
  const folderData = files.find((file) => file.name === folder);
  const filesToShow = files.filter((file) => folderData?.id === file.parents[0]);
  return (
    <>
      {title !== "" && <h2 className={styles.heading2}>{title}</h2>}
      <div className={styles.cardWrapper}>
        {filesToShow.map((file) => (
          <div key={file.id} className="relative">
            <Card shadow="sm" isPressable onPress={() => console.log("item pressed")} contextMenu="true" className={styles.card}>
              <CardBody className={styles.cardBody}>
                <Image shadow="sm" radius="lg" width="100%" alt={file.name} className={styles.image} src={file.thumbnailLink} />
              </CardBody>
              <CardFooter className={styles.cardFooter}>
                <b>{file.name}</b>
              </CardFooter>
            </Card>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="flat" className={styles.dropDownBtn}>
                  ⋮
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Action event example"
                onAction={(key) => {
                  if (key === "delete") {
                    removeFile(file.id, folder);
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
