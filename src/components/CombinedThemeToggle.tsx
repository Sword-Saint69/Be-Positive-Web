import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { ThemeToggleButton2 } from "@/components/ui/skiper-ui/skiper4";

export default function CombinedThemeToggle() {
  const handleClick = () => {
    const btn = document.getElementById("magicui-theme-toggle");
    btn?.click();
  };

  return (
    <div onClick={handleClick} className="cursor-pointer inline-block">
      <AnimatedThemeToggler
        id="magicui-theme-toggle"
        className="sr-only"
        variant="circle"
        duration={400}
      />
      <ThemeToggleButton2 className="size-12" />
    </div>
  );
}
