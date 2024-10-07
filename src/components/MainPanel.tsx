"use client";

import { useGlobal } from "@/drivers/GlobalContext";
import { useEffect, useState } from "react";

export default function MainPanel(props: any) {
  // Global States
  const { listFiles, createFile, removeFile, user, files } = useGlobal();

  const fetchFiles = async () => { listFiles(); };
  useEffect(() => {
    if (user.loggedIn === true) { fetchFiles(); }
  }, [user]);
  return (
    <div>
      {props.page} Main
      <button onClick={() => { createFile(); }}>
        CreateFile
      </button>
      <div>
        {files.map((file) => (
          <div key={file.id} className="border m-2 p-2 flex flex-col gap-1 w-[8rem]">
            <span>{file.name}</span>
            <button
              onClick={() => {
                removeFile(file.id);
              }}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
