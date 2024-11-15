import { useGlobal } from "@/drivers/GlobalContext";
import { Button } from "@nextui-org/react";
import styles from "@/components/MainPanel.module.css";
import toast from "react-hot-toast";

export default function Upload(props: { page: string }) {
  const { page } = props;
  // Global context
  const { createFile } = useGlobal();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    toast.promise(
      new Promise<void>(async (resolve) => {
        if (e.target.files) {
          const file = e.target.files[0];
          console.log("File: ", file);
          if (file) {
            await createFile(file, page);
          }
          resolve();
        }
      }),
      {
        loading: "Uploading...",
        success: "File uploaded successfully!",
        error: "Failed to upload file.",
      }
    );
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
