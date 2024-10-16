import { useGlobal } from "@/drivers/GlobalContext";
import styles from "../MainPanel.module.css";
import { Button, Card, CardBody, CardFooter, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image } from "@nextui-org/react";

export default function Carousel(props: { title: string }) {
  // Global States
  const { files, removeFile } = useGlobal();
  // Props
  const { title } = props;
  return (
    <>
      <h2 className={styles.heading2}>{title}</h2>
      <div className={styles.cardWrapper}>
        {files.map((file) => (
          <div key={file.id} className="relative">
            <Card shadow="sm" isPressable onPress={() => console.log("item pressed")} contextMenu="true" className={styles.card}>
              <CardBody className={styles.cardBody}>
                <Image shadow="sm" radius="lg" width="100%" alt={""} className={styles.image} src={"https://placehold.co/600x400"} />
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
                    removeFile(file.id);
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
