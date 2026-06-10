import type { PropsWithChildren } from 'react';
import "../native.css";

export function PlatformSpecificProvider({ children }: PropsWithChildren) {
  return <>{children}</>;
}