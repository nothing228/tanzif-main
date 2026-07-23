/** Payment methods shown under the trust grid. */

export type PaymentId = "click" | "payme" | "uzum" | "qr" | "humo" | "uzcard";

export type PaymentMethod = {
  id: PaymentId;
  name: string;
  file: string;
};

export const PAYMENTS: PaymentMethod[] = [
  { id: "click", name: "Click", file: "click.svg" },
  { id: "payme", name: "Payme", file: "payme.svg" },
  { id: "uzum", name: "Uzum Bank", file: "uzum.svg" },
  { id: "humo", name: "Humo", file: "humo.svg" },
  { id: "uzcard", name: "Uzcard", file: "uzcard.svg" },
  { id: "qr", name: "Единый QR", file: "qr.svg" },
];
