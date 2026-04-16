import { useState, useEffect, useCallback } from "react";

type Theme = "dark" | "light";
type Palette = "lumen" | "liminal" | "parallax" | "praxis" | "axiom";

const PALETTE_BG: Record<Palette, Record<Theme, string>> = {
  lumen:    { dark: "#191b2a", light: "#F1F2F6" },
  liminal:  { dark: "#140e0e", light: "#f2ede4" },
  parallax: { dark: "#0d1117", light: "#f3f5f8" },
  praxis:   { dark: "#120f0a", light: "#f5f0e6" },
  axiom:    { dark: "#0b0f18", light: "#f0f2f6" },
};

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem("lumen-theme") as Theme) || "dark";
  });
  const [palette, setPaletteState] = useState<Palette>(() => {
    return (localStorage.getItem("lumen-palette") as Palette) || "lumen";
  });

  const apply = useCallback((t: Theme, p: Palette) => {
    const root = document.documentElement;
    root.setAttribute("data-theme", t);
    if (p && p !== "lumen") {
      root.setAttribute("data-palette", p);
    } else {
      root.removeAttribute("data-palette");
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      const colors = PALETTE_BG[p] || PALETTE_BG.lumen;
      meta.setAttribute("content", colors[t] || colors.dark);
    }
    // Update body background for smooth transitions
    const bg = PALETTE_BG[p]?.[t] || PALETTE_BG.lumen[t];
    document.body.style.backgroundColor = bg;
    root.style.backgroundColor = bg;
  }, []);

  useEffect(() => {
    apply(theme, palette);
  }, [theme, palette, apply]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("lumen-theme", next);
      return next;
    });
  }, []);

  const setPalette = useCallback((p: Palette) => {
    setPaletteState(p);
    localStorage.setItem("lumen-palette", p);
  }, []);

  return { theme, palette, toggleTheme, setPalette };
}
