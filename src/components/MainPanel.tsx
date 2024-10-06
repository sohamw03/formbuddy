"use client";

import { useGlobal } from "@/drivers/GlobalContext";
import { useEffect, useState } from "react";

export default function MainPanel(props: any) {
  // Global States
  const { listFiles, createFile, removeFile } = useGlobal();
  // Local States
  const [files, setFiles] = useState<Array<{ name: string; id: string }>>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const file_list = await listFiles();
      setFiles(file_list.map((file) => ({ name: file.name, id: file.id })));
    };
    fetchFiles();
  }, []);
  return (
    <div>
      {props.page} Main
      <div>
        {files.map((file) => (
          <div key={file.id} className="border m-2 p-2 flex flex-col gap-1 w-[8rem]">
            <span>{file.name}</span>
            <button onClick={() => removeFile(file.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
