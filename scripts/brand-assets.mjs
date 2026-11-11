// Renders every raster brand asset from the vector logos in logo/.
// Run `npm run brand` after changing logo/*.svg or the brand colours below; it also runs
// capacitor-assets so the Android/iOS icons and splash screens are regenerated.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const DARK = "#00231F"; // app background / icon tile
const MARK = readFileSync("logo/diyaar-mark.svg", "utf8").match(/ d="([^"]+)"/)[1];
const MARK_W = 300;
const MARK_H = 315.5;

/** Mark height as a share of the icon: the original artwork (315.5/670) made 20% bigger so it reads like other app icons. */
const ICON_SCALE = (315.5 / 670) * 1.2;

/** SVG of the mark centred on a square canvas. `scale` is the mark's height as a share of the canvas. */
function markSvg(size, { bg, scale = ICON_SCALE, radius = 0 } = {}) {
  const k = (size * scale) / MARK_H;
  const x = (size - MARK_W * k) / 2;
  const y = (size - MARK_H * k) / 2;
  const tile = bg ? `<rect width="${size}" height="${size}" rx="${radius * size}" fill="${bg}"/>` : "";
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">${tile}` +
      `<path fill="#00E784" transform="translate(${x} ${y}) scale(${k})" d="${MARK}"/></svg>`,
  );
}

const png = (svg, file, { flatten } = {}) => {
  let img = sharp(svg, { density: 72 }).png({ compressionLevel: 9 });
  if (flatten) img = img.flatten({ background: flatten });
  return img.toFile(file);
};

const solid = (size, color, file) =>
  sharp({ create: { width: size, height: size, channels: 3, background: color } }).png().toFile(file);

/** A .ico holding PNG images (supported by every browser since IE Vista). */
async function ico(sizes, file) {
  const images = await Promise.all(sizes.map((s) => sharp(markSvg(s, { bg: DARK, radius: 0.22 })).png().toBuffer()));
  const head = Buffer.alloc(6 + 16 * images.length);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(images.length, 4);
  let offset = head.length;
  images.forEach((buf, i) => {
    const e = 6 + 16 * i;
    head.writeUInt8(sizes[i] % 256, e);
    head.writeUInt8(sizes[i] % 256, e + 1);
    head.writeUInt16LE(1, e + 4);
    head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(buf.length, e + 8);
    head.writeUInt32LE(offset, e + 12);
    offset += buf.length;
  });
  writeFileSync(file, Buffer.concat([head, ...images]));
}

mkdirSync("assets", { recursive: true });
await Promise.all([
  // capacitor-assets sources (Android adaptive icon shows the foreground at the same size as the iOS icon)
  png(markSvg(1024, { bg: DARK }), "assets/icon-only.png", { flatten: DARK }),
  png(markSvg(1024), "assets/icon-foreground.png"),
  solid(1024, DARK, "assets/icon-background.png"),
  // native splash is a plain colour; the web LaunchScreen then animates the mark on the same colour
  solid(2732, DARK, "assets/splash.png"),
  solid(2732, DARK, "assets/splash-dark.png"),
  // web
  png(markSvg(512, { bg: DARK, radius: 0.22 }), "public/favicon.png"),
  png(markSvg(180, { bg: DARK }), "public/apple-touch-icon.png", { flatten: DARK }),
  ico([16, 32, 48], "public/favicon.ico"),
  // exports for people who need a PNG of the logo
  png(markSvg(1024, { bg: DARK }), "logo/diyaar-icon-1024.png", { flatten: DARK }),
  png(markSvg(1024, { bg: "#FFFFFF" }), "logo/diyaar-icon-light-1024.png", { flatten: "#FFFFFF" }),
  sharp(Buffer.from(readFileSync("logo/diyaar-mark.svg")), { density: 72 * 4 }).png().toFile("logo/diyaar-mark.png"),
  // store-kit source (store/source/render.sh turns it into the store icons)
  png(markSvg(1024, { bg: DARK }), "store/source/assets/app-icon-source.png", { flatten: DARK }),
]);
console.log("Brand assets written.");
