import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <div className="container-premium flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
        404
      </p>
      <h1 className="mt-3 font-display text-4xl text-ink-900">Page not found</h1>
      <p className="mt-3 max-w-md text-ink-500">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Go Home</ButtonLink>
        <ButtonLink href="/shop" variant="outline">
          Browse Shop
        </ButtonLink>
      </div>
      <p className="mt-8 text-sm text-ink-400">
        Need help?{" "}
        <Link href="/contact" className="text-brand-700 hover:underline">
          Contact us
        </Link>
      </p>
    </div>
  );
}
