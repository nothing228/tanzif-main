/**
 * Client logos shown in the strip under the hero. Files live in
 * `public/partners`, normalised to 120px tall so the row lines up.
 *
 * These are raster, not SVG: several of the sources are photographs (a wall
 * sign, a café interior, a clinic reception) and the rest are full-colour
 * artwork with gradients — auto-tracing them would visibly change how they
 * look, which is exactly what a brand's logo must not do.
 */
export interface Partner {
  name: string;
  file: string;
}

export const PARTNERS: Partner[] = [
  { name: "Baby House", file: "baby-house.png" },
  { name: "Color Baby House", file: "color-baby-house.png" },
  { name: "Dreamland", file: "dreamland.jpg" },
  { name: "Cakelab", file: "cakelab.jpg" },
  { name: "Katta Tanaffus", file: "katta-tanaffus.jpg" },
  { name: "Огни Ташкента", file: "ogni-tashkenta.jpg" },
  { name: "SV Hotel", file: "sv-hotel.jpg" },
  { name: "Orzu Hotel", file: "orzu-hotel.jpg" },
  { name: "Global Coffee", file: "global-coffee.jpg" },
  { name: "Happy Spoon", file: "happy-spoon.jpg" },
  { name: "Rich Clinic", file: "rich-clinic.jpg" },
  { name: "Total Look", file: "total-look.jpg" },
];
