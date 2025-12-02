"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { components } from "@/lib/registry/components";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type ComponentOption = {
  id: string;
  label: string;
  href: string;
};

const componentOptions: ComponentOption[] = components.map((component) => ({
  id: component.id,
  label: component.displayName,
  href: `/component/${component.id}`,
}));

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Toggle command palette with Cmd+K / Ctrl+K
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        (event.key === "k" || event.key === "K") &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        setOpen((open) => !open);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSelect = (option: ComponentOption) => {
    setOpen(false);

    // Let any open editors snapshot their state before navigation so that
    // cached edits are restored correctly after the route change.
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("tweakcn:before-component-change"));
    }

    if (pathname !== option.href) {
      router.push(option.href);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="h-9 w-full max-w-xs justify-between text-xs text-muted-foreground sm:text-sm"
        onClick={() => setOpen(true)}
      >
        <span className="truncate">Search components...</span>
        <kbd className="ml-2 hidden rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
          ⌘K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search components by name..." />
        <CommandList>
          <CommandEmpty>No components found.</CommandEmpty>
          <CommandGroup heading="Components">
            {componentOptions.map((option) => (
              <CommandItem
                key={option.id}
                value={option.label}
                onSelect={() => handleSelect(option)}
              >
                <span>{option.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default GlobalSearch;


