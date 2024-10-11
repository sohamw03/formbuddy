import { useGlobal } from "@/drivers/GlobalContext";
import styles from "../MainPanel.module.css";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";

export default function Carousel(props: { title: string }) {
  // Global States
  const { files } = useGlobal();
  // Props
  const { title } = props;
  return (
    <>
      <h2 className={styles.heading2}>{title}</h2>
      <div className={styles.cardWrapper}>
        {files.map((file) => (
          <Card shadow="sm" key={file.id} isPressable onPress={() => console.log("item pressed")} contextMenu="true">
            <CardBody className={styles.cardBody}>
              <Image shadow="sm" radius="lg" width="100%" alt={""} className={styles.image} src={"https://placehold.co/600x400"} />
            </CardBody>
            <CardFooter className={styles.cardFooter}>
              <b>{file.name}</b>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
