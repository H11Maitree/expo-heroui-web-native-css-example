import { useThemeColor } from "heroui-native";
import { View } from "react-native";
import MenuExample from "./MenuExample";

export default function Index() {
  const backgroundColor = useThemeColor("background");
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: backgroundColor,
      }}
    >
      <MenuExample />
    </View>
  );
}
