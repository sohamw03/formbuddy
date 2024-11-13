import { type fileObj, useGlobal } from "@/drivers/GlobalContext";
import { Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import styles from "./Toolbar.module.css";
import { type Crop } from "react-image-crop";
import toast from "react-hot-toast";

export default function Toolbar({ resolution, crop, percentCrop, fileState }: { resolution: { width: number; height: number }; crop: Crop | undefined; fileState: { file: fileObj; setFile: React.Dispatch<React.SetStateAction<fileObj | undefined>> }; percentCrop: Crop | undefined }) {
  // Global states
  const { toolbarMode, setToolbarMode, cropImage } = useGlobal();
  // Local state
  const [res, setRes] = useState(resolution);

  // Update engine
  useEffect(() => {
    switch (toolbarMode) {
      case "crop":
        if (percentCrop) setRes({ width: Math.round((percentCrop!.width / 100) * resolution.width), height: Math.round((percentCrop!.height / 100) * resolution.height) });
        break;
      case "normal":
        setRes(resolution);
        break;
    }
  }, [crop, percentCrop, toolbarMode, resolution]);

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarInWrapper}>
        {/* @react-image-crop */}
        {(() => {
          switch (toolbarMode) {
            case "normal":
              return (
                <>
                  <div className="ps-2" style={{ justifySelf: "start" }}>
                    100%
                    {/* https://imagekit.io/blog/image-cropping-in-react-application */}
                  </div>
                  <div style={{ justifySelf: "center" }}>
                    {res.width} x {res.height}
                  </div>
                  <div>
                    <Button className={styles.toolBtn} variant="flat" onClick={() => setToolbarMode("crop")} style={{ justifySelf: "end" }}>
                      <img src="/icons/crop_icon.svg" alt="crop" />
                    </Button>
                  </div>
                </>
              );
            case "crop":
              return (
                <>
                  <div style={{ justifySelf: "start" }}></div>
                  <div style={{ justifySelf: "center" }}>
                    {res.width} x {res.height}
                  </div>
                  <div style={{ justifySelf: "end" }}>
                    <Button
                      className={styles.toolBtn}
                      variant="flat"
                      onClick={async () => {
                        setToolbarMode("normal");
                        toast.success(`Cropped image at size ${res.width} x ${res.height}.`);
                        const newBlobURL = await cropImage(fileState.file.id, {
                          unit: "px",
                          x: (percentCrop!.x / 100) * resolution.width,
                          y: (percentCrop!.y / 100) * resolution.height,
                          width: res.width,
                          height: res.height,
                        } as Crop);
                        console.log(newBlobURL);
                        const variant = {
                          name: `${fileState.file.name} [cropped] [${res.width}x${res.height}]`,
                          id: "",
                          mimeType: fileState.file.mimeType,
                          parents: fileState.file.parents,
                          thumbnailLink: "",
                          blobURL: newBlobURL,
                        } as unknown as fileObj;
                        fileState.setFile(variant);
                        setToolbarMode("cropped");
                      }}>
                      <img src="/icons/done_icon.svg" alt="done" />
                    </Button>
                  </div>
                </>
              );
            case "cropped":
              return (
                <>
                  <div style={{ justifySelf: "start" }}></div>
                  <div style={{ justifySelf: "center" }}>
                    {res.width} x {res.height}
                  </div>
                  <div style={{ justifySelf: "end" }}>
                    <Button
                      className={styles.saveBtn}
                      variant="flat"
                      onClick={() => {
                        console.log("Save");
                      }}>
                      Save
                    </Button>
                  </div>
                </>
              );
          }
        })()}
      </div>
    </div>
  );
}
