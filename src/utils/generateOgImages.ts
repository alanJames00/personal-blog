import { initWasm, Resvg } from "@resvg/resvg-wasm";
import { type CollectionEntry } from "astro:content";
import postOgImage from "./og-templates/post";
import siteOgImage from "./og-templates/site";

// You'll need to fetch the WASM file or import it
// Some integrations like '@vercel/og' or 'satori' handle this, 
// but for raw resvg-wasm:
await initWasm(fetch('https://unpkg.com/@resvg/resvg-wasm/index_bg.wasm'));

function svgBufferToPngBuffer(svg: string) {
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
}

export async function generateOgImageForPost(post: CollectionEntry<"blog">) {
  const svg = await postOgImage(post);
  return svgBufferToPngBuffer(svg);
}

export async function generateOgImageForSite() {
  const svg = await siteOgImage();
  return svgBufferToPngBuffer(svg);
}
