import { useState } from "react";
import ReactCrop, { type PercentCrop, type PixelCrop, type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export default function CropPlugin({ isOpen, src }: { isOpen: boolean; src: string }) {
  if (!isOpen) return null;

  const [crop, setCrop] = useState<Crop>();

  const onComplete = (crop: PixelCrop, percentCrop: PercentCrop) => {
    console.log(crop, percentCrop);
  };
  return (
    <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={onComplete}>
      <img src={src} />
    </ReactCrop>
  );
}
