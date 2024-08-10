import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Input } from "./ui/input";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { getEmojis } from "@atlaskit/util-data-test/get-emojis";
import { useEffect, useState } from "react";

export default function EmojiPicker({ value, setValue }) {
  const allEmojis = getEmojis();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between font-normal">
          {value
            ? allEmojis.find((emoji) => emoji.shortName === value)?.shortName
            : "Pick emoji"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command shouldFilter={false}>
          <CommandList>
            <CommandInput
              onValueChange={(value) => {
                setInputValue(value);
              }}></CommandInput>
            <CommandEmpty>No emoji found.</CommandEmpty>
            <CommandGroup>
              {allEmojis
                .filter((emoji) =>
                  emoji.shortName.includes(inputValue.toLowerCase())
                )
                .sort((a, b) => a.shortName.length - b.shortName.length)
                .toSpliced(1)
                .map((emoji, index) => {
                  if (index <= 2) {
                    return (
                      <CommandItem
                        key={emoji.shortName}
                        value={emoji.shortName}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}>
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === emoji.shortName
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <div
                          style={{
                            height: "66px",
                            width: "66px",
                            backgroundPosition: `-${emoji.representation.x}px -${emoji.representation.y}px`,
                            backgroundImage: `url(${emoji.representation.sprite?.url})`,
                          }}></div>
                        {emoji.shortName}
                      </CommandItem>
                    );
                  }
                })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
