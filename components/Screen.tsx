import { useThemeColor } from "heroui-native";
import type { PropsWithChildren } from "react";
import { View } from "react-native";

export default function Screen({ children }: PropsWithChildren) {
  const backgroundColor = useThemeColor("background");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor,
      }}
    >
      {children}
    </View>
  );
}
