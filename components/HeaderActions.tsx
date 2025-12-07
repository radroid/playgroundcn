"use client";

import Link from "next/link";

import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      role="img"
    >
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.26c0 4.51 2.87 8.33 6.84 9.68.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.13-1.52-1.13-1.52-.93-.65.07-.64.07-.64 1.03.07 1.57 1.08 1.57 1.08.91 1.59 2.4 1.13 2.99.86.09-.67.36-1.13.65-1.39-2.22-.26-4.56-1.14-4.56-5.09 0-1.13.39-2.05 1.03-2.78-.1-.26-.45-1.31.1-2.72 0 0 .84-.27 2.75 1.06A9.17 9.17 0 0 1 12 6.07c.85 0 1.71.12 2.51.36 1.9-1.33 2.74-1.06 2.74-1.06.56 1.41.21 2.46.11 2.72.64.73 1.03 1.65 1.03 2.78 0 3.96-2.34 4.82-4.57 5.08.37.33.7.98.7 1.98 0 1.43-.01 2.58-.01 2.93 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      role="img"
    >
      <path
        fill="currentColor"
        d="M18.9 3H21l-4.6 5.26L21.8 21h-4.6l-3.2-6.72L9 21H6.9l4.9-5.6L5 3h4.7l2.9 6.18L18.9 3Zm-1.6 15.4h1.2L8.8 4.5H7.5l9.8 13.9Z"
      />
    </svg>
  );
}

const iconButtonClassName =
  "inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50/80 text-zinc-900 shadow-sm transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-50 dark:hover:bg-zinc-800";

export function HeaderActions() {
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="https://github.com/radroid/playgroundcn"
            target="_blank"
            rel="noreferrer"
            aria-label="Open GitHub repository"
            className={iconButtonClassName}
          >
            <GitHubIcon />
          </Link>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>View GitHub repo</TooltipContent>
      </Tooltip>

      <HoverCard openDelay={50}>
        <HoverCardTrigger asChild>
          <Link
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Open X"
            className={iconButtonClassName}
          >
            <XIcon />
          </Link>
        </HoverCardTrigger>
        <HoverCardContent className="flex items-center gap-1.5 w-auto max-w-min p-1.5 rounded-full">
          <div className="flex -space-x-2">
            <Link
              href="https://x.com/curlycloud__"
              target="_blank"
              rel="noreferrer"
              aria-label="Raj on X"
              className="group inline-flex"
            >
              <Avatar className="ring-background size-9 ring-2 border border-background transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-105">
                <AvatarImage src="/raj-matcha.png" alt="Raj avatar" />
                <AvatarFallback>R</AvatarFallback>
              </Avatar>
            </Link>
            <Link
              href="https://x.com/rud_dudd"
              target="_blank"
              rel="noreferrer"
              aria-label="Rudra on X"
              className="group inline-flex"
            >
              <Avatar className="ring-background size-9 ring-2 border border-background transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-105">
                <AvatarImage src="/rudra-watercolor.png" alt="Rudra avatar" />
                <AvatarFallback>R</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

export default HeaderActions;


