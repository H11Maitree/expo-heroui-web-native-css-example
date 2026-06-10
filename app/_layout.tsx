import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PlatformSpecificProvider } from "./PlatformSpecificProvider";

export default function RootLayout() {
  return (
    <PlatformSpecificProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <HeroUINativeProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </HeroUINativeProvider>
      </GestureHandlerRootView>
    </PlatformSpecificProvider>
  );
}
