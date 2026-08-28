import { getMenuSections } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";

/**
 * Product feed for NETICS (and anything else that reads a Shopify-shaped
 * `/products.json`). Generated from the same menu the site renders, so a price
 * edited in /admin reaches the agent on its next nightly check without anyone
 * retyping it.
 *
 * Prices are emitted in major units — naira, two decimals — because that is
 * what the Shopify shape expects; internally we store kobo.
 */
export const revalidate = 300;

export async function GET() {
  const sections = await getMenuSections();

  const products = sections.flatMap((section) =>
    section.items.map((item) => ({
      id: item.id,
      title: item.name,
      handle: `${section.slug}-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
      body_html: item.description ?? "",
      vendor: "Whiskey Mistress",
      // The sub-heading where there is one (Whiskey, Cognac…), else the section.
      product_type: item.group_label ?? section.name,
      tags: [section.name, item.group_label, item.is_signature ? "Signature" : null]
        .filter(Boolean) as string[],
      url: `${siteUrl}/menu`,
      images: item.image_url
        ? [{ src: item.image_url.startsWith("http") ? item.image_url : `${siteUrl}${item.image_url}` }]
        : [],
      variants: [
        {
          id: `${item.id}-default`,
          title: "Default Title",
          price: (item.price_minor / 100).toFixed(2),
          currency: item.currency,
          available: item.availability !== "sold_out",
          inventory_quantity: item.availability === "sold_out" ? 0 : 99,
        },
      ],
    })),
  );

  return Response.json(
    {
      // Prices exclude the service charge and VAT added at the till.
      note: "Prices in NGN, excluding 5% service charge and 7.5% VAT.",
      products,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
      },
    },
  );
}
