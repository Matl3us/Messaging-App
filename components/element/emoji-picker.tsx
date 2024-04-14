import { Smile } from "lucide-react";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Smile size="24" />
      </PopoverTrigger>
      <PopoverContent
        side="top"
        sideOffset={40}
        className="bg-transparent border-none shadow-none drop-shadow-none -mb-6"
      >
        <Picker
          data={data}
          perLine="8"
          previewPosition="none"
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
