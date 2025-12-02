"use client"

import * as React from "react"

import {
  Combobox,
  type ComboboxOption,
} from "@/components/ui/combobox"

const frameworks: ComboboxOption[] = [
  { value: "nextjs", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "gatsby", label: "Gatsby" },
]

export function ComboboxDemo() {
  const [value, setValue] = React.useState("")

  return (
    <Combobox
      options={frameworks}
      value={value}
      onValueChange={setValue}
      placeholder="Select framework..."
      emptyText="No framework found."
    />
  )
}

export default ComboboxDemo;


