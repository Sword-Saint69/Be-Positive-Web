"use client";

import clsx from "clsx";
import { useState } from "react";

interface NavItem {
  name: string;
}

interface MorphicNavbarProps {
  items?: Record<string, NavItem>;
  defaultPath?: string;
  className?: string;
}

const DEFAULT_NAV_ITEMS: Record<string, NavItem> = {
  "/": { name: "home" },
  "/works": { name: "works" },
  "/blog": { name: "blog" },
  "/about": { name: "about" },
};

export function MorphicNavbar({
  items = DEFAULT_NAV_ITEMS,
  defaultPath = "/",
  className,
}: MorphicNavbarProps) {
  const [activePath, setActivePath] = useState(defaultPath);

  const isActiveLink = (path: string) => {
    if (path === "/") {
      return activePath === "/";
    }
    return activePath.startsWith(path);
  };

  return (
    <nav className={clsx("mx-auto max-w-4xl px-4 py-2", className)}>
      <div className="flex items-center justify-center">
        <div className="glass flex items-center justify-between overflow-hidden rounded-xl">
          {Object.entries(items).map(([path, { name }], index, array) => {
            const isActive = isActiveLink(path);
            const isFirst = index === 0;
            const isLast = index === array.length - 1;
            const prevPath = index > 0 ? array[index - 1][0] : null;
            const nextPath =
              index < array.length - 1 ? array[index + 1][0] : null;

            return (
              <a
                className={clsx(
                  "flex items-center justify-center bg-slate-100 p-1.5 px-4 text-sm text-slate-800 transition-all duration-300 hover:bg-slate-200",
                  isActive
                    ? "mx-2 rounded-xl font-semibold text-sm bg-teal-600 text-white hover:bg-teal-700"
                    : clsx(
                        (isActiveLink(prevPath || "") || isFirst) &&
                          "rounded-l-xl",
                        (isActiveLink(nextPath || "") || isLast) &&
                          "rounded-r-xl"
                      )
                )}
                href={path}
                key={path}
                onClick={() => setActivePath(path)}
              >
                {name}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default MorphicNavbar;
