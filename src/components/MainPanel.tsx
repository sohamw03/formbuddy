"use client";

import { useGlobal } from "@/drivers/GlobalContext";
import { Button } from "@nextui-org/button";
import { Card, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { useEffect } from "react";

export default function MainPanel(props: any) {
  // Global States
  const { listFiles, createFile, removeFile, user, files } = useGlobal();

  const fetchFiles = async () => {
    listFiles();
  };
  useEffect(() => {
    if (user.loggedIn === true) {
      fetchFiles();
    }
  }, [user]);
  return (
    // <div>
    //   {props.page} Main
    //   <button onClick={() => { createFile(); }}>
    //     CreateFile
    //   </button>
    //   <div>
    //     {files.map((file) => (
    //       <div key={file.id} className="border m-2 p-2 flex flex-col gap-1 w-[8rem]">
    //         <span>{file.name}</span>
    //         <button
    //           onClick={() => {
    //             removeFile(file.id);
    //           }}>
    //           Remove
    //         </button>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <div>
      <h1 className="text-large font-semibold">Recents</h1>
      <h2 className="text-medium font-medium">Photos</h2>
      <div className="relative overflow-y-hidden flex items-center border border-default-200 dark:border-default-100 px-2 py-4 rounded-large overflow-hidden">
        <Card radius="lg" className="border-none">
          <Image alt="Woman listing to music" className="object-cover" height={200} src="https://nextui.org/images/hero-card.jpeg" width={200} />
          <CardFooter className="">
            <p className="text-tiny text-white/80">Available soon.</p>
            <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
              Notify me
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
