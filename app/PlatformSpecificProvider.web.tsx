import type { PropsWithChildren } from 'react';
import "../web.css";

export function PlatformSpecificProvider({ children }: PropsWithChildren) {
  return <>{children}</>;
}