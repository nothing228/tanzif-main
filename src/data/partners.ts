/**
 * Client logos shown in the strip under the hero. Files live in
 * `public/partners`, normalised to 120px tall so the row lines up.
 *
 * Most are now crisp vector (SVG) redraws; a few remain raster where the
 * source is a photograph (a wall sign, a café interior) that can't be traced
 * without changing how the brand actually looks.
 */
export interface Partner {
  name: string;
  file: string;
}

export const PARTNERS: Partner[] = [
  { name: "Baby House", file: "baby-house.png" },
  { name: "Color Baby House", file: "color-baby-house.svg" },
  { name: "Cakelab", file: "cakelab.png" },
  { name: "Dreamland", file: "dreamland.svg" },
  { name: "Katta Tanaffus", file: "katta-tanaffus.jpg" },
  { name: "Огни Ташкента", file: "ogni-tashkenta.svg" },
  { name: "SV Hotel", file: "sv-hotel.svg" },
  { name: "Orzu Hotel", file: "orzu-hotel.svg" },
  { name: "Happy Spoon", file: "happy-spoon.svg" },
  { name: "Rich Clinic", file: "rich-clinic.svg" },
  { name: "Total Look", file: "total-look.svg" },
  { name: "Global Coffee", file: "global-coffee.png" },
];
