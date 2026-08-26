const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SAND = "#F7F4ED";
const CLAY = "#B4522F";
const MOSS = "#3E6B4A";
const POT = "#C88B6A";

const OUT = path.join(__dirname, "..", "assets", "images");
const SITE = process.env.BROTO_WEB_DIR ?? path.join(__dirname, "..", "..", "web");

const LEAF =
  "M38 39C38 22 30 15 20 9C34 12 41 23 42 34C44 20 53 12 64 8C52 17 45 26 44 39H38Z";
const FIT =
  "translate(256 306) scale(6.3529) translate(-42 -39)";
const BODY = "M-94 2 L94 2 L72 96 Q72 112 54 112 L-54 112 Q-72 112 -72 96 Z";

const BOX = { cx: 256, cy: 286, height: 355 };

function mark(plant, pot, rim) {
  return `
  <g transform="${FIT}" fill="${plant}">
    <path d="${LEAF}"/>
  </g>
  <g transform="translate(256 352)">
    <rect x="-108" y="-46" width="216" height="40" rx="14" fill="${rim}"/>
    <path d="${BODY}" fill="${pot}"/>
  </g>`;
}

function canvas({ background, scale, flat, radius }) {
  const factor = (512 * scale) / BOX.height;
  const inner = flat ? mark(flat, flat, flat) : mark(MOSS, POT, CLAY);
  const corner = radius ? ` rx="${radius}"` : "";

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  ${background ? `<rect width="512" height="512"${corner} fill="${background}"/>` : ""}
  <g transform="translate(256 256) scale(${factor.toFixed(4)}) translate(-${BOX.cx} -${BOX.cy})">
    ${inner}
  </g>
</svg>`);
}

const targets = [
  { file: "icon.png", size: 1024, background: SAND, scale: 0.74 },
  { file: "android-icon-foreground.png", size: 1024, scale: 0.46 },
  {
    file: "android-icon-monochrome.png",
    size: 1024,
    scale: 0.46,
    flat: "#000000",
  },
  { file: "splash-icon.png", size: 512, scale: 0.86 },
  { file: "favicon.png", size: 196, background: SAND, scale: 0.76, radius: 112 },
  { file: "mark.png", size: 240, scale: 0.9, out: SITE },
  { file: "favicon.png", size: 180, background: SAND, scale: 0.74, radius: 112, out: SITE },
];

const SITE_FAVICON = { background: SAND, scale: 0.74, radius: 112 };

async function run() {
  fs.mkdirSync(OUT, { recursive: true });

  for (const target of targets) {
    const file = path.join(target.out ?? OUT, target.file);

    await sharp(canvas(target), { density: 384 })
      .resize(target.size, target.size)
      .png({ compressionLevel: 9 })
      .toFile(file);

    console.log(target.file + "  " + target.size + "px");
  }

  fs.writeFileSync(
    path.join(OUT, "icon.svg"),
    canvas({ background: SAND, scale: 0.74 }).toString(),
  );

  fs.writeFileSync(
    path.join(SITE, "favicon.svg"),
    canvas(SITE_FAVICON).toString(),
  );
}

run();
