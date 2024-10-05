"use client";

import { useGlobal } from "@/drivers/GlobalContext";

export default function MainPanel(props: any) {
  const { getFiles, createFile } = useGlobal();

  return (
    <div>
      {props.page} Main
      <div>
        <button onClick={getFiles}>Get Files</button>
      </div>
      <div>
        <button onClick={createFile}>Create config.json</button>
      </div>
    </div>
  );
}
