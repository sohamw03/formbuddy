import { useGlobal } from "@/drivers/GlobalContext";

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
  return <input type="file" onChange={handleFileUpload} />;
}
