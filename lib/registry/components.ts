import type { ComponentEntry } from "./types";

/**
 * Static registry of Shadcn UI components used by the playground.
 *
 * This data is derived from the `shadcn-components - shadcn-components (2).csv`
 * file: we keep only the metadata and example code here, while the actual
 * implementations live in `components/ui/*` and are managed by the Shadcn CLI.
 *
 * PREVIEW FILES SYSTEM:
 * =====================
 * Instead of embedding example code inline in this file, you can create preview
 * files in `components/previews/`. The system will automatically load and use
 * preview files if they exist, taking precedence over examples defined here.
 *
 * Naming convention for preview files:
 * - Single preview: `{componentId}-preview.tsx`
 * - Multiple previews: `{componentId}-preview.tsx`, `{componentId}-preview-2.tsx`, etc.
 *
 * Example structure for accordion-preview.tsx:
 * ```tsx
 * export function AccordionDemo() {
 *   return <Accordion>...</Accordion>;
 * }
 * export default AccordionDemo;
 * ```
 *
 * The system will automatically:
 * - Find all preview files for a component
 * - Transform the code to Sandpack-compatible format
 * - Generate example IDs and names (first preview = "default", others = "Preview 2", etc.)
 *
 * As you add more rows from the CSV, follow the same structure used for the
 * `button` and `card` entries below. Examples here will be used as fallback
 * if no preview files exist.
 */
export const components: ComponentEntry[] = [
  {
    id: "button",
    displayName: "Button",
    category: "ui",
    description: "Shadcn ui: Button",
    sandpackTemplate: "react-ts",
    dependencies: {
      react: "19.2.0",
      "react-dom": "19.2.0",
      "@radix-ui/react-slot": "^1.0.0",
      "class-variance-authority": "^0.7.1",
      "lucide-react": "^0.555.0",
    },
    registryDependencies: [],
    files: [{ path: "ui/button.tsx", type: "registry:ui" }],
    examples: [
      {
        id: "default",
        name: "Default",
        code: `import { ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <Button variant="outline">Button</Button>
      <Button variant="outline" size="icon" aria-label="Submit">
        <ArrowUpIcon />
      </Button>
    </div>
  );
}
`,
      },
    ],
  },
  {
    id: "card",
    displayName: "Card",
    category: "ui",
    description: "Shadcn ui: Card",
    sandpackTemplate: "react-ts",
    dependencies: {
      react: "19.2.0",
      "react-dom": "19.2.0",
      "@radix-ui/react-slot": "^1.0.0",
      "@radix-ui/react-label": "^2.1.1",
    },
    registryDependencies: ["button", "input", "label"],
    files: [{ path: "ui/card.tsx", type: "registry:ui" }],
    examples: [
      {
        id: "login",
        name: "Login form",
        code: `import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function App() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
`,
      },
    ],
  },
];
