import { useGlobal } from "@/drivers/GlobalContext";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import styles from "./Toolbar.module.css";
import { type Crop } from "react-image-crop";
import toast from "react-hot-toast";

export default function Toolbar({ resolution, crop }: { resolution: { width: number; height: number }; crop: Crop | undefined }) {
  // Global states
  const { toolbarMode, setToolbarMode } = useGlobal();
  // Local state
  const [res, setRes] = useState(resolution);

  // Crop the selected image
  const cropImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = res.width;
    canvas.height = res.height;
    ctx.drawImage(
      document.querySelector<HTMLImageElement>("#image") as HTMLImageElement,
      crop?.x || 0,
      crop?.y || 0,
      crop?.width || 0,
      crop?.height || 0,
      0,
      0,
      res.width,
      res.height
    );
    const dataURL = canvas.toDataURL("image/png");
    return dataURL;
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
