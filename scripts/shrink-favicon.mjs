// One-off: shrink the oversized favicon.png (576KB source photo) to 360×360.
// 360px covers every consumer at retina density: browser/apple icon (≤180px @2x)
// and the about-photo (120px) which is served via the next/image optimizer anyway.
// The original remains recoverable from git history.
import sharp from "sharp";
import { renameSync, statSync } from "node:fs";

const src = "public/favicon.png";
const tmp = "public/favicon.tmp.png";

const before = statSync(src).size;
const meta = await sharp(src).metadata();

await sharp(src)
  .resize(360, 360, { fit: "cover" })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(tmp);

renameSync(tmp, src);
const after = statSync(src).size;

console.log(
  `favicon.png: ${meta.width}x${meta.height} ${(before / 1024).toFixed(0)}KB -> 360x360 ${(after / 1024).toFixed(0)}KB`
);
