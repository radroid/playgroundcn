/**
 * Vite React TypeScript template code generators for Sandpack.
 * Uses Tailwind CSS v4 via CDN with inline theme configuration.
 */

/**
 * Generate index.html with Tailwind CDN and inline theme CSS.
 * Theme CSS is injected inline in a <style type="text/tailwindcss"> block.
 */
export const getIndexHtml = (themeCss: string, isDark: boolean) => `<!doctype html>
<html lang="en" class="${isDark ? "dark" : ""}">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Component Preview</title>
    <script>
      // Suppress Vite dev server warnings
      (function() {
        const originalWarn = console.warn;
        console.warn = function(message, ...args) {
          if (typeof message === 'string') {
            // Suppress "clearScreenDown" warning
            if (message.includes('clearScreenDown')) {
              return;
            }
            // Suppress Vite CJS deprecation warning
            if (message.includes("CJS build of Vite's Node API is deprecated")) {
              return;
            }
          }
          originalWarn.apply(console, [message, ...args]);
        };
      })();
    </script>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <style type="text/tailwindcss">
${themeCss}
    </style>
  </head>
  <body style="margin: 0; padding: 0; display: flex; align-items: flex-start; justify-content: center; overflow-x: auto; box-sizing: border-box; width: 100%;">
    <div id="root" style="width: 100%; max-width: 100%; padding: 20px; box-sizing: border-box; flex-shrink: 0;"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

/**
 * Generate main.tsx entry point.
 */
export const getMainTsx = () => `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)`;

/**
 * Generate App.tsx that renders the preview component.
 * The preview code should already be in App format (export default function App()).
 * We just return it as-is since it's already transformed by preview-reader.ts.
 */
export const getAppTsx = (previewCode: string) => {
  // Preview code is already transformed to have export default function App()
  // by the preview-reader.ts transformPreviewCode function
  return previewCode || `export default function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="p-4 text-muted-foreground">
          No preview code provided. Please add preview code.
        </div>
      </div>
    </div>
  );
}`;
};

/**
 * Generate index.css (minimal, Tailwind is loaded via CDN).
 */
export const getIndexCss = () => `/* Tailwind CSS is loaded via CDN */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: auto;
}

#root {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
}`;

/**
 * Generate minimal vite.config.ts.
 * Only configures path aliases - no esbuild-wasm configuration needed.
 */
export const getViteConfig = () => `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})`;

/**
 * Generate TypeScript configuration.
 */
export const TSCONFIG_CODE = `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}`;

/**
 * Utility code for cn function.
 */
export const UTILS_CODE = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

/**
 * use-mobile hook code.
 */
export const USE_MOBILE_CODE = `import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}`;

