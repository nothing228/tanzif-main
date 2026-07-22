/**
 * Single source of truth for TANZIF's public links.
 * Display text (phone numbers, address, handles) lives in the translations —
 * this file holds only the URLs, so they are changed in one place.
 */
export const CONTACTS = {
  /** public channel */
  telegram: "https://t.me/tanzif_clean",
  /** direct line to a human, offered by the AI concierge */
  telegramAdmin: "https://t.me/tanzif_admin1",
  instagram: "https://www.instagram.com/tanzif_cleaning",
  phone: "+998935705150",
  phone2: "+998935705992",
  email: "info@tanzif.uz",
  /** opens the pickup address in Google Maps */
  maps: "https://www.google.com/maps/search/?api=1&query=Toshkent+Maxtumquli+koʻchasi+136",
} as const;
