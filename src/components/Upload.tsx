import { useGlobal } from "@/drivers/GlobalContext";
import { Button } from "@nextui-org/react";
import styles from "@/components/MainPanel.module.css";

export default function Upload(props: { page: string }) {
  const { page } = props;
  // Global context
  const { createFile } = useGlobal();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      console.log("File: ", file);
      if (file) {
        createFile(file, page);
      }
    }
  };
  return (
    <Button className={styles.uploadBtn} color="default" variant="flat">
      <label htmlFor="uploadip">
        <img src="/icons/plus_icon.svg" width={30} height={30} alt="plus_icon" />
      </label>
      <input id="uploadip" type="file" onChange={handleFileUpload} />
    </Button>
  );
}
