export const categorise = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes("google") || n.includes("pixel")) return "Google";
  if (
    n.includes("rog") || n.includes("alienware") || n.includes("apple") ||
    n.includes("samsung") || n.includes("xbox") || n.includes("playstation") ||
    n.includes("psx") || n.includes("overwatch") || n.includes("ibm") ||
    n.includes("zelda") || n.includes("watch dogs") || n.includes("darth")
  )
    return "Brand & Gaming";
  if (
    n.includes("hud") || n.includes("circuit") || n.includes("digital") ||
    n.includes("glitch") || n.includes("tech") || n.includes("alien") ||
    n.includes("cyber") || n.includes("matrix")
  )
    return "Sci-Fi & Tech";
  if (
    n.includes("load") || n.includes("dots") || n.includes("line") ||
    n.includes("point") || n.includes("bubble") || n.includes("preloader")
  )
    return "Minimalist";
  return "Abstract";
};
