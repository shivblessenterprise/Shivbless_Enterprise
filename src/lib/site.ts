import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Shivbless Enterprise",
  tagline: "Premium products for everyday rituals.",
  description:
    "Shivbless Enterprise — browse premium pooja essentials and shop securely through Meesho and Flipkart.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "shivblessenterprise@gmail.com",
  meeshoStoreUrl: "https://www.meesho.com/Shivbless89364?ms=2",
  flipkartStoreUrl:
    "https://www.flipkart.com/shivbless-enterprise-velvet-prayer-mat/p/itm75ea6ab7b86e4?pid=MATHZHQF9XGREWCA&lid=LSTMATHZHQF9XGREWCA4IYCRQ&marketplace=FLIPKART",
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    youtube: "https://youtube.com",
  },
};

export const announcements = [
  "Shop Shivbless products securely on Meesho and Flipkart.",
  "Premium pooja essentials — browse here, buy on trusted marketplaces.",
];

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
