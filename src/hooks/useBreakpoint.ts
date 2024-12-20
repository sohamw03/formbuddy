"use client";
import { useEffect, useState } from "react";

export function useBreakpoint(width: number) {
  const [isBelowWidth, setIsBelowWidth] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setIsBelowWidth(window.innerWidth < width);
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, [width]);

  return isBelowWidth;
}
