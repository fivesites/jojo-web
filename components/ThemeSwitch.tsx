import { Button } from "./ui/button";
import { SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      {theme === "light" ? (
        <Button size="sm" variant="ghost" onClick={() => setTheme("dark")}>
          Dark / Light
        </Button>
      ) : (
        <Button size="sm" variant="ghost" onClick={() => setTheme("light")}>
          Light / Dark
        </Button>
      )}
    </>
  );
}
