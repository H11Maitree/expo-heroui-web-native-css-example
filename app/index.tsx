import MenuExample from "@/components/MenuExample";
import Screen from "@/components/Screen";
import { useState } from "react";

export default function Index() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Screen>
      <MenuExample isOpen={isOpen} onOpenChange={setIsOpen} />
    </Screen>
  );
}
