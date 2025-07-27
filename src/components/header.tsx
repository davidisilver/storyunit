"use client";

import { Logo } from "./logo";

export default function Header() {
  return (
    <header className="px-4 py-2 flex justify-between items-center border-b border-border">
      <h1 className="text-lg font-medium">
        <Logo />
      </h1>
    </header>
  );
}
