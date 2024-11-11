import { useGlobal } from "@/drivers/GlobalContext";
import { cn } from "@nextui-org/react";
import ReactCrop, { type Crop, type PixelCrop, type PercentCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import EntityStyles from "../Entity.module.css";
import { useEffect, useState } from "react";

export default function CropPlugin({ isOpen, src, crop, setCrop, percentCrop, setPercentCrop }: { isOpen: boolean; src: string; crop: Crop | undefined; setCrop: React.Dispatch<React.SetStateAction<Crop | undefined>>; percentCrop: Crop | undefined; setPercentCrop: React.Dispatch<React.SetStateAction<Crop | undefined>> }) {
  if (!isOpen) return null;

  const [localCrop, setLocalCrop] = useState<Crop>();

  const onComplete = (crop: PixelCrop, percentCrop: PercentCrop) => {
    console.log(crop, percentCrop);
    setCrop(crop);
    setPercentCrop(percentCrop);
  };

  useEffect(() => {
    setLocalCrop(crop);
  }, []);

  return (
    <div className={cn(EntityStyles.modalBody, "flex justify-center w-full")}>
      <ReactCrop //
        crop={localCrop}
        onChange={(c) => setLocalCrop(c)}
        onComplete={onComplete}
        ruleOfThirds>
        <img src={src} className={cn(EntityStyles.image, "w-full")} />
      </ReactCrop>
    </div>
  );
}
