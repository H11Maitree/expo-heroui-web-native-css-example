import { HeroUINativeProvider } from "heroui-native";
import type { PropsWithChildren } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../styles/native.css";

export function PlatformSpecificProvider({ children }: PropsWithChildren) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider
        config={{
          toast: {
            defaultProps: {
              placement: "top",
            },
          },
        }}
      >
        {children}
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
