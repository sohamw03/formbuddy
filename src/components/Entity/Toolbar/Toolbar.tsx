import { useEffect, useState } from "react";
import styles from "./Toolbar.module.css";
import { useGlobal } from "@/drivers/GlobalContext";
export default function Toolbar() {
  // Global context
  const { currImgRef, isOpen, openedFileId } = useGlobal();
  const [resolution, setResolution] = useState({ width: currImgRef?.current?.naturalWidth, height: currImgRef?.current?.naturalHeight });

  // Extract resolution of the image when it is loaded
  const extractResolution = () => {
    setResolution({ width: currImgRef?.current?.naturalWidth, height: currImgRef?.current?.naturalHeight });
  };
  useEffect(() => {
    currImgRef?.current?.addEventListener("load", extractResolution);
    if (currImgRef?.current)
      currImgRef.current.onload = () => {
        extractResolution();
      };
    return () => {
      currImgRef?.current?.removeEventListener("load", extractResolution);
    };
  }, []);
  useEffect(() => {
    extractResolution();
  }, [openedFileId, isOpen]);

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
          Crop
          {/* https://valentinh.github.io/react-easy-crop */}
        </div>
      </div>
    </div>
  );
}
