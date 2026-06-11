import { Stack } from "expo-router";
import { PlatformSpecificProvider } from "../components/PlatformSpecificProvider";

export default function RootLayout() {
  return (
    <PlatformSpecificProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </PlatformSpecificProvider>
  );
}
