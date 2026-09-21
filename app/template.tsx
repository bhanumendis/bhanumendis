/**
 * © 2025–2026 Bhanu Mendis · https://bhanumendis.com
 * All rights reserved. Designed, built and maintained by Bhanu Mendis.
 * Unauthorised copying, redistribution or reuse of this file, in whole or in
 * part, is prohibited without written permission. See LICENSE.
 */
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
