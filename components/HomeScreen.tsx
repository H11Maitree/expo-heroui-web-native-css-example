import { useThemeColor } from "heroui-native";
import { View } from "react-native";
import MenuExample from "./MenuExample";

export default function HomeScreen() {
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
      <MenuExample />
    </View>
  );
}
