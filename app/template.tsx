"use client";

import { useEffect } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const blockRightClick = (e: MouseEvent) => {
      e.preventDefault();
    };
    const blockDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", blockRightClick);
    document.addEventListener("dragstart", blockDragStart);

    return () => {
      document.removeEventListener("contextmenu", blockRightClick);
      document.removeEventListener("dragstart", blockDragStart);
    };
  }, []);

  return <>{children}</>;
}
