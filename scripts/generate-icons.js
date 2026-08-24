const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SAND = "#F7F4ED";
const CLAY = "#B4522F";
const MOSS = "#3E6B4A";
const POT = "#C88B6A";

const OUT = path.join(__dirname, "..", "assets", "images");
const LEGAL = path.join(__dirname, "..", "legal");

const LEAF =
  "M0 0 C-56 -40.12 -40.32 -96.76 0 -118 C40.32 -96.76 56 -40.12 0 0 Z";
const CROWN =
  "M0 0 C-58 -49.64 -41.76 -119.72 0 -146 C41.76 -119.72 58 -49.64 0 0 Z";
const BODY = "M-94 2 L94 2 L72 96 Q72 112 54 112 L-54 112 Q-72 112 -72 96 Z";

const BOX = { cx: 256, cy: 263, height: 402 };

function mark(plant, pot, rim) {
  return `
  <g transform="translate(256 320)" fill="${plant}">
    <rect x="-10" y="-136" width="20" height="150" rx="10"/>
    <g transform="translate(0 -112)">
      <g transform="rotate(-54)"><path d="${LEAF}"/></g>
      <g transform="rotate(54)"><path d="${LEAF}"/></g>
      <path d="${CROWN}"/>
    </g>
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
  { file: "android-icon-foreground.png", size: 1024, scale: 0.6 },
  {
    file: "android-icon-monochrome.png",
    size: 1024,
    scale: 0.6,
    flat: "#000000",
  },
  { file: "splash-icon.png", size: 512, scale: 0.86 },
  { file: "favicon.png", size: 196, background: SAND, scale: 0.76 },
  { file: "mark.png", size: 240, scale: 0.9, out: LEGAL },
  {
    file: "favicon.png",
    size: 180,
    background: MOSS,
    flat: SAND,
    scale: 0.88,
    radius: 112,
    out: LEGAL,
  },
];

const SITE_FAVICON = {
  background: MOSS,
  flat: SAND,
  scale: 0.88,
  radius: 112,
};

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
    path.join(LEGAL, "favicon.svg"),
    canvas(SITE_FAVICON).toString(),
  );
}

run();
