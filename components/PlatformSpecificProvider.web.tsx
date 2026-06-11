import { ToastProvider } from "@heroui/react";
import type { PropsWithChildren } from "react";
import "../styles/web.css";

export function PlatformSpecificProvider({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <ToastProvider placement="top" />
    </>
  );
}
