/** Real before/after cases — mappings match Tanzif Before After *.dc.html templates. */

export type GalleryKey =
  | "avtokreslo"
  | "divan1"
  | "divan2"
  | "kepka"
  | "gilam"
  | "kolyaska1"
  | "kolyaska2"
  | "kreslo"
  | "lyulka"
  | "matras"
  | "podushki";

export type GalleryShot =
  | { kind: "pair"; before: string; after: string; beforeFilter?: string }
  | { kind: "splitX"; src: string };

export type GalleryItem = {
  key: GalleryKey;
  shot: GalleryShot;
};

export const GALLERY_ITEMS: GalleryItem[] = [
  { key: "avtokreslo", shot: { kind: "splitX", src: "/gallery/avtokreslo.jpg" } },
  { key: "divan1", shot: { kind: "splitX", src: "/gallery/divan1.jpg" } },
  {
    key: "divan2",
    shot: { kind: "pair", before: "/gallery/divan2-before.jpg", after: "/gallery/divan2-after.jpg" },
  },
  { key: "kepka", shot: { kind: "splitX", src: "/gallery/kepka.jpg" } },
  {
    key: "gilam",
    shot: { kind: "pair", before: "/gallery/gilam-before.jpg", after: "/gallery/gilam-after.jpg" },
  },
  {
    key: "kolyaska1",
    shot: {
      kind: "pair",
      before: "/gallery/kolyaska1-before.jpg",
      after: "/gallery/kolyaska1-after.jpg",
      beforeFilter: "saturate(0.85) brightness(0.92)",
    },
  },
  {
    key: "kolyaska2",
    shot: {
      kind: "pair",
      before: "/gallery/kolyaska2-before.jpg",
      after: "/gallery/kolyaska2-after.jpg",
    },
  },
  {
    key: "kreslo",
    shot: { kind: "pair", before: "/gallery/kreslo-before.jpg", after: "/gallery/kreslo-after.jpg" },
  },
  {
    key: "lyulka",
    shot: { kind: "pair", before: "/gallery/lyulka-before.jpg", after: "/gallery/lyulka-after.jpg" },
  },
  {
    key: "matras",
    shot: { kind: "pair", before: "/gallery/matras-before.jpg", after: "/gallery/matras-after.jpg" },
  },
  {
    key: "podushki",
    shot: { kind: "pair", before: "/gallery/pillows-before.jpg", after: "/gallery/pillows-after.jpg" },
  },
];

export const GALLERY_KEYS = GALLERY_ITEMS.map((i) => i.key);
