import { type fileObj, useGlobal } from "@/drivers/GlobalContext";
import { Button, Input, Popover, PopoverContent, PopoverTrigger, Slider, SliderValue } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import styles from "./Toolbar.module.css";
import { type Crop } from "react-image-crop";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Toolbar({ resolution, crop, percentCrop, fileState }: { resolution: { width: number; height: number }; crop: Crop | undefined; fileState: { file: fileObj; setFile: React.Dispatch<React.SetStateAction<fileObj | undefined>> }; percentCrop: Crop | undefined }) {
  // Global states
  const { toolbarMode, setToolbarMode, cropImage, createFile, currFolder, onClose, files, openedFileId } = useGlobal();
  // Local state
  const [res, setRes] = useState(resolution);
  const [saveDisabled, setSaveDisabled] = useState(false);
  const [cropDisabled, setCropDisabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [quality, setQuality] = useState<SliderValue>(100);

  // Update engine
  useEffect(() => {
    switch (toolbarMode) {
      case "crop":
        if (percentCrop) setRes({ width: Math.round((percentCrop!.width / 100) * resolution.width), height: Math.round((percentCrop!.height / 100) * resolution.height) });
        break;
      case "normal":
        setRes(resolution);
        break;
      case "cropped":
        setRes(resolution);
        break;
    }
  }, [crop, percentCrop, toolbarMode, resolution]);

  const resolutionBlock = (
    <div style={{ justifySelf: "center", height: "100%", alignContent: "center" }}>
      {res.width} x {res.height}
    </div>
  );

  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} style={{ background: "inherit" }}>
      <motion.div
        className={styles.toolbar}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{
          duration: 0.4,
          delay: isHovered ? 0 : 1.5,
        }}>
        <div className={styles.toolbarInWrapper}>
          {(() => {
            switch (toolbarMode) {
              case "normal":
                return (
                  <>
                    <div style={{ justifySelf: "start", height: "100%" }}>
                      <Popover placement="top-start" showArrow offset={10} style={{ width: "15rem" }}>
                        <PopoverTrigger>
                          <Button className={styles.qualityBtn} variant="flat" style={{ justifySelf: "start" }}>
                            {quality}%
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          {(titleProps) => (
                            <div className="px-1 py-2 w-full">
                              <p className="text-small font-bold text-foreground" {...titleProps}>
                                Quality
                              </p>
                              <div className="mt-2 flex flex-col gap-2 w-full">
                                <Slider step={1} maxValue={100} minValue={0} defaultValue={100} size="md" color="foreground" showTooltip className="max-w-md" value={quality} onChange={setQuality} onDoubleClick={() => setQuality(100)} />
                              </div>
                            </div>
                          )}
                        </PopoverContent>
                      </Popover>
                    </div>
                    {resolutionBlock}
                    <div style={{ height: "100%" }}>
                      <Button className={styles.toolBtn} variant="flat" onClick={() => setToolbarMode("crop")} style={{ justifySelf: "end" }} disabled={cropDisabled}>
                        <img src="/icons/crop_icon.svg" alt="crop" />
                      </Button>
                    </div>
                  </>
                );
              case "crop":
                return (
                  <>
                    <div style={{ justifySelf: "start", height: "100%" }}>
                      <Button className={styles.cancelBtn} variant="flat" onClick={() => setToolbarMode("normal")}>
                        <img src="/icons/plus_icon.svg" alt="close" />
                      </Button>
                    </div>
                    {resolutionBlock}
                    <div style={{ justifySelf: "end", height: "100%" }}>
                      <Button
                        className={styles.toolBtn}
                        variant="flat"
                        onClick={() => {
                          toast.promise(
                            new Promise<void>(async (resolve, reject) => {
                              try {
                                setCropDisabled(true);
                                setToolbarMode("normal");
                                const newBlobURL = await cropImage(fileState.file.id, {
                                  unit: "px",
                                  x: (percentCrop!.x / 100) * resolution.width,
                                  y: (percentCrop!.y / 100) * resolution.height,
                                  width: res.width,
                                  height: res.height,
                                } as Crop);

                                console.log(newBlobURL);
                                // Create a new file object for the cropped image
                                const variant = {
                                  name: fileState.file.name,
                                  id: "",
                                  mimeType: fileState.file.mimeType,
                                  parents: fileState.file.parents,
                                  thumbnailLink: "",
                                  blobURL: newBlobURL,
                                } as unknown as fileObj;
                                fileState.setFile(variant);
                                setToolbarMode("cropped");
                                setCropDisabled(false);
                                resolve();
                              } catch (error) {
                                setCropDisabled(false);
                                reject(error);
                              }
                            }),
                            {
                              loading: "Cropping...",
                              success: `Cropped image @ [${res.width} x ${res.height}]`,
                              error: "Failed to crop.",
                            }
                          );
                        }}>
                        <img src="/icons/done_icon.svg" alt="done" />
                      </Button>
                    </div>
                  </>
                );
              case "cropped":
                return (
                  <>
                    <div style={{ justifySelf: "start", height: "100%" }}>
                      <Button
                        className={styles.cancelBtn}
                        variant="flat"
                        onClick={() => {
                          setToolbarMode("normal");
                          fileState.setFile((prev) => files.find((file) => file.id === openedFileId));
                        }}>
                        <img src="/icons/plus_icon.svg" alt="close" />
                      </Button>
                    </div>
                    {resolutionBlock}
                    <div style={{ justifySelf: "end", height: "100%" }}>
                      <Button
                        className={styles.saveBtn}
                        variant="flat"
                        onClick={() => {
                          toast.promise(
                            new Promise<void>(async (resolve, reject) => {
                              try {
                                onClose();
                                setSaveDisabled(true);
                                // Convert blobURL to File
                                const response = await fetch(fileState.file.blobURL);
                                const blob = await response.blob();
                                const croppedFile = new File([blob], fileState.file.name, { type: blob.type });
                                // Send the cropped file to the backend
                                await createFile(croppedFile, currFolder, true);
                                resolve();
                              } catch (error) {
                                reject(error);
                              }
                            }),
                            {
                              loading: "Saving...",
                              success: "Saved!",
                              error: "Failed to save.",
                            }
                          );
                        }}
                        disabled={saveDisabled}>
                        Save
                      </Button>
                    </div>
                  </>
                );
            }
          })()}
        </div>
      </motion.div>
    </div>
  );
}
