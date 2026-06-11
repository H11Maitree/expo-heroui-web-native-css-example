import { Ionicons } from "@expo/vector-icons";
import type { Selection } from "@heroui/react";
import {
  Button,
  Description,
  Dropdown,
  Header,
  Kbd,
  Label,
  Separator,
  toast,
} from "@heroui/react";
import { useState } from "react";

export default function MenuExample() {
  const [textStyles, setTextStyles] = useState<Selection>(
    () => new Set(["World"]),
  );
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button aria-label="Menu" variant="secondary">
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color="var(--accent)"
        />
        {isOpen ? "Close" : "Open"}
      </Button>

      <Dropdown.Popover className="min-w-[200px]">
        <Dropdown.Menu>
          <Dropdown.Item id="banananonina" textValue="Banananonina">
            <Ionicons name="sparkles" size={16} />
            <span className="flex min-w-0 flex-col">
              <Label>Banananonina</Label>
              <Description>Tulaliloo ti amo</Description>
            </span>
          </Dropdown.Item>

          <Separator />

          <Dropdown.Section
            selectionMode="multiple"
            selectedKeys={textStyles}
            onSelectionChange={setTextStyles}
          >
            <Header className="mb-1 px-2.5">Hello</Header>
            <Dropdown.Item id="World" textValue="World">
              <Dropdown.ItemIndicator />
              <Label>World</Label>
              <Kbd slot="keyboard">⌘ W</Kbd>
            </Dropdown.Item>
            <Dropdown.Item id="Babie" textValue="Babie">
              <Dropdown.ItemIndicator />
              <Label>Babie</Label>
              <Kbd slot="keyboard">⌘ B</Kbd>
            </Dropdown.Item>
          </Dropdown.Section>

          <Separator />

          <Dropdown.Section>
            <Header className="mb-1 px-2.5 text-danger">Happy</Header>
            <Dropdown.Item
              id="hack"
              textValue="Hacking"
              variant="danger"
              onAction={() =>
                toast.danger("Hacking", {
                  description: "Hacking action selected.",
                })
              }
            >
              <Ionicons name="bug" size={16} color="var(--danger)" />
              <Label>Hacking</Label>
            </Dropdown.Item>
          </Dropdown.Section>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
