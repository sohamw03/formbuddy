"use client";
import { forwardRef, LegacyRef, RefObject, useEffect, useState } from "react";
import ReactCrop, { type Crop, type PercentCrop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import EntityStyles from "../Entity.module.css";

export const CropPlugin = forwardRef(
  (
    {
      isOpen,
      src,
      crop,
      setCrop,
      percentCrop,
      setPercentCrop,
      calcImgStyle,
    }: {
      isOpen: boolean;
      src: string;
      crop: Crop | undefined;
      setCrop: React.Dispatch<React.SetStateAction<Crop | undefined>>;
      percentCrop: Crop | undefined;
      setPercentCrop: React.Dispatch<React.SetStateAction<Crop | undefined>>;
      calcImgStyle: string;
    },
    ref: LegacyRef<HTMLDivElement>,
  ) => {
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
      <div className={EntityStyles.modalBody} ref={ref}>
        <ReactCrop //
          className={calcImgStyle}
          crop={localCrop}
          onChange={(c) => setLocalCrop(c)}
          onComplete={onComplete}
          ruleOfThirds
        >
          <img src={src} className={calcImgStyle} />
        </ReactCrop>
      </div>
    );
  },
);

export default CropPlugin;
