import { Button, Dropdown, Label } from "@heroui/react";
import { useState } from "react";

export default function MenuExample() {
    const [open, setOpen] = useState(false);
    
    return (
        <Dropdown isOpen={open} onOpenChange={setOpen}>
        <Button aria-label="Menu" variant="secondary">
          Actions
        </Button>
        <Dropdown.Popover>
          <Dropdown.Menu>
            <Dropdown.Item id="new-file" textValue="New file">
              <Label>New file</Label>
            </Dropdown.Item>
            <Dropdown.Item id="open-file" textValue="Open file">
              <Label>Open file</Label>
            </Dropdown.Item>
            <Dropdown.Item id="save-file" textValue="Save file">
              <Label>Save file</Label>
            </Dropdown.Item>
            <Dropdown.Item id="delete-file" textValue="Delete file" variant="danger">
              <Label>Delete file</Label>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    );
}