import ContactClient from "./ContactClient";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Bulk Inquiry",
  description:
    "Submit a bulk / wholesale inquiry to Shivbless Enterprise.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactClient />;
}
