import { View } from "react-native";
import MenuExample from "./MenuExample";

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "var(--background)",
      }}
    >
      <MenuExample />
    </View>
  );
}
