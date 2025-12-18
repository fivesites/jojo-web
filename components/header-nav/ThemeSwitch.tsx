import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Badge } from "../ui/badge";

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔑 Prevent SSR mismatch
  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";
  return (
    <>
      <div
        role="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="space-x-1 "
      >
        <Badge variant="ghost" className={` `}>
          {isDark ? "Dark" : "Light"}
        </Badge>
        <Badge
          variant="ghost"
          className=" opacity-30  transition-colors line-through "
        >
          {isDark ? "Light" : "Dark"}
        </Badge>
      </div>
    </>
  );
}
