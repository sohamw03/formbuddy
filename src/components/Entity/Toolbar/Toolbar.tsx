import { Button } from "@nextui-org/react";
import { useState } from "react";
import styles from "./Toolbar.module.css";
export default function Toolbar({ resolution }: { resolution: { width: number; height: number } }) {
  // Local state
  const [res, setRes] = useState(resolution);

  const onCropClick = () => {
    console.log("Crop clicked");
  };
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarInWrapper}>
        <div>
          100%
          {/* https://imagekit.io/blog/image-cropping-in-react-application */}
        </div>
        <div>
          {resolution.width} x {resolution.height}
        </div>
        <div>
          {/* @react-image-crop */}
          <Button className={styles.cropBtn} variant="bordered" onClick={onCropClick}>
            <img src="/icons/crop_icon.svg" alt="crop" />
          </Button>
        </div>
      </div>
    </div>
  );
}
