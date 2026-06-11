import { Ionicons } from "@expo/vector-icons";
import type { MenuKey } from "heroui-native";
import {
  Button,
  Menu,
  Separator,
  useThemeColor,
  useToast,
} from "heroui-native";
import { useState } from "react";
import { Text, View } from "react-native";

const menuIndicatorColor = "#7c7f87";

interface MenuExampleProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function MenuExample({
  isOpen,
  onOpenChange,
}: MenuExampleProps) {
  const [accentColor, dangerColor] = useThemeColor(["accent", "danger"]);
  const { toast } = useToast();
  const [textStyles, setTextStyles] = useState<Set<MenuKey>>(
    () => new Set(["World"]),
  );

  return (
    <Menu isOpen={isOpen} onOpenChange={onOpenChange}>
      <Menu.Trigger asChild>
        <Button variant="secondary">
          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color={accentColor}
          />
          <Button.Label>{isOpen ? "Close" : "Open"}</Button.Label>
        </Button>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Overlay />
        <Menu.Content presentation="popover" width={200}>
          <Menu.Item className="items-start">
            <View className="flex-1 flex-row items-center gap-3">
              <Ionicons name="sparkles" size={16} />
              <View className="flex-1">
                <Menu.ItemTitle>Banananonina</Menu.ItemTitle>
                <Menu.ItemDescription>Tulaliloo ti amo</Menu.ItemDescription>
              </View>
            </View>
          </Menu.Item>
          <Separator className="mx-2 my-2 opacity-75" />
          <Menu.Label className="mb-1">Hello</Menu.Label>
          <Menu.Group
            selectionMode="multiple"
            selectedKeys={textStyles}
            onSelectionChange={setTextStyles}
          >
            <Menu.Item id="World">
              <Menu.ItemIndicator
                iconProps={{ color: menuIndicatorColor }}
              />
              <Menu.ItemTitle>World</Menu.ItemTitle>
              <Text className="text-sm text-muted">⌘ W</Text>
            </Menu.Item>
            <Menu.Item id="Babie">
              <Menu.ItemIndicator
                iconProps={{ color: menuIndicatorColor }}
              />
              <Menu.ItemTitle>Babie</Menu.ItemTitle>
              <Text className="text-sm text-muted">⌘ B</Text>
            </Menu.Item>
          </Menu.Group>

          <Separator className="mx-2 my-2 opacity-75" />
          <Menu.Label className="mb-1 text-danger">Happy</Menu.Label>
          <Menu.Group>
            <Menu.Item
              id="hack"
              variant="danger"
              onPress={() =>
                toast.show({
                  variant: "danger",
                  label: "Hacking",
                  description: "Hacking action selected.",
                })
              }
            >
              <Ionicons name="bug" size={16} color={dangerColor} />
              <Menu.ItemTitle>Hacking</Menu.ItemTitle>
            </Menu.Item>
          </Menu.Group>
        </Menu.Content>
      </Menu.Portal>
    </Menu>
  );
}
