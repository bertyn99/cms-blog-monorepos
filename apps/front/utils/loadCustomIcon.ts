import {
  cleanupSVG,
  importDirectorySync,
  isEmptyColor,
  parseColors,
  runSVGO,
  SVG,
} from "@iconify/tools";
import { compareColors, stringToColor } from "@iconify/utils/lib/colors";
import { readdirSync, readFileSync, lstatSync } from "fs";
import { join } from "path"; // Import the 'join' function from the 'path' module

export function FileSystemIconLoader(dir: string, transform?: any) {
  const files = readdirSync(dir).filter((f) => f.endsWith(".svg"));
  const result = new Map();

  files.forEach((file) => {
    const filename = join(dir, file); // Use the 'join' function to get the full path of the file
    const stat = lstatSync(filename);
    if (stat.isFile()) {
      let svg = new SVG(readFileSync(filename, "utf-8"));
      // Clean up and optimise icons
      try {
        cleanupSVG(svg);
        parseColors(svg, {
          defaultColor: "currentColor",
          callback: (attr, colorStr, color) => {
            return !color || isEmptyColor(color) ? colorStr : "currentColor";
          },
        });
        runSVGO(svg);
      } catch (err) {
        // Invalid icon
        console.error(`Error parsing ${name}:`, err);
        return;
      }

      result.set(file.replace(".svg", ""), {
        body: svg.getBody(),
        width: svg.viewBox.width,
        height: svg.viewBox.height,
        top: svg.viewBox.top,
        left: svg.viewBox.left,
      });
    }
  });

  return { icons: Object.fromEntries(result) };
}
