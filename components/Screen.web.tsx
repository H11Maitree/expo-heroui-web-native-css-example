import type { PropsWithChildren } from "react";
import { View } from "react-native";

export default function Screen({ children }: PropsWithChildren) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "var(--background)",
      }}
    >
      {children}
    </View>
  );
}
