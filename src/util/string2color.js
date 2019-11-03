import createRng from "./rng";
import convert from "color-convert";

export default function string2color(str, lightness) {
  const rand = createRng(str);

  const colorHue = Math.min(Math.max(rand() * 360, 0), 360);
  const hexColor = "#" + convert.hsl.hex(colorHue, 100, lightness);
  return hexColor;
}
