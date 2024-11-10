import { type fileObj, useGlobal } from "@/drivers/GlobalContext";
import { Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import styles from "./Toolbar.module.css";
import { type Crop } from "react-image-crop";
import toast from "react-hot-toast";

export default function Toolbar({ resolution, crop, fileState }: { resolution: { width: number; height: number }; crop: Crop | undefined; fileState: { file: fileObj; setFile: React.Dispatch<React.SetStateAction<fileObj | undefined>> } }) {
  // Global states
  const { toolbarMode, setToolbarMode } = useGlobal();
  // Local state
  const [res, setRes] = useState(resolution);

  // Crop the selected image
  const cropImage = () => {
    if (!crop) return;
    const image = new Image();
    image.src = fileState.file.blobURL;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, crop.width, crop.height);

    // Converting to base64
    const base64Image = canvas.toDataURL(fileState.file.mimeType);
    console.log(base64Image);
    return base64Image;
  };

  // Update engine
  useEffect(() => {
    switch (toolbarMode) {
      case "crop":
        setRes({ width: crop?.width || 0, height: crop?.height || 0 });
        break;
      case "normal":
        setRes(resolution);
        break;
    }
  }, [crop, toolbarMode, resolution]);

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarInWrapper}>
        {/* @react-image-crop */}
        {(() => {
          switch (toolbarMode) {
            case "normal":
              return (
                <>
                  <div>
                    100%
                    {/* https://imagekit.io/blog/image-cropping-in-react-application */}
                  </div>
                  <div>
                    {res.width} x {res.height}
                  </div>
                  <div>
                    <Button className={styles.toolBtn} variant="flat" onClick={() => setToolbarMode("crop")}>
                      <img src="/icons/crop_icon.svg" alt="crop" />
                    </Button>
                  </div>
                </>
              );
            case "crop":
              return (
                <>
                  <div className="w-12"></div>
                  <div>
                    {res.width} x {res.height}
                  </div>
                  <div>
                    <Button
                      className={styles.toolBtn}
                      variant="flat"
                      onClick={() => {
                        setToolbarMode("normal");
                        toast.success(`Cropped image at size ${res.width} x ${res.height}.`);
                        const variant = {
                          name: `${fileState.file.name} [cropped] [${res.width}x${res.height}]`,
                          id: "",
                          mimeType: fileState.file.mimeType,
                          parents: fileState.file.parents,
                          thumbnailLink: "",
                          blobURL: cropImage(),
                        } as unknown as fileObj;
                        fileState.setFile(variant);
                      }}>
                      <img src="/icons/done_icon.svg" alt="done" />
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
