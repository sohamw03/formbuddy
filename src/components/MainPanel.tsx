"use client";

import { useGlobal } from "@/drivers/GlobalContext";

export default function MainPanel(props: any) {
  const { getDriveAppDataFolder } = useGlobal();

  return (
    <div>
      {props.page} Main
      <button onClick={getDriveAppDataFolder}>CallSession</button>
    </div>
  );
}
