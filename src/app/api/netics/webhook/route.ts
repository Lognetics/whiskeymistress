import crypto from "node:crypto";

/**
 * NETICS webhook receiver.
 *
 * NETICS signs every delivery as `X-Netics-Signature: t=<unix>,v1=<hex HMAC>`,
 * where the HMAC-SHA256 is keyed with the `whsec_…` secret over
 * `"<timestamp>.<raw body>"`. The signature covers the exact bytes sent, so we
 * read the raw text and never parse-then-reserialise before verifying.
 *
 * Register this URL in the dashboard under API & Webhooks:
 *   https://whiskeymistress.vercel.app/api/netics/webhook
 */

export const dynamic = "force-dynamic";

/** NETICS allows ~5 minutes of clock skew; anything older is a replay. */
const TOLERANCE_SECONDS = 300;

function verify(rawBody: string, header: string | null, secret: string) {
  if (!header) return false;

  const parts = Object.fromEntries(
    header.split(",").map((part) => {
      const i = part.indexOf("=");
      return i === -1 ? [part, ""] : [part.slice(0, i).trim(), part.slice(i + 1).trim()];
    }),
  );

  const timestamp = Number(parts.t);
  if (!Number.isFinite(timestamp)) return false;
  if (Math.abs(Date.now() / 1000 - timestamp) > TOLERANCE_SECONDS) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${parts.t}.${rawBody}`)
    .digest("hex");

  const given = Buffer.from(parts.v1 ?? "", "utf8");
  const wanted = Buffer.from(expected, "utf8");
  return given.length === wanted.length && crypto.timingSafeEqual(given, wanted);
}

export async function POST(request: Request) {
  const secret = process.env.NETICS_WEBHOOK_SECRET;
  if (!secret) {
    // Fail closed: without the secret nothing can be trusted.
    return new Response("webhook secret not configured", { status: 503 });
  }

  const rawBody = await request.text();

  if (!verify(rawBody, request.headers.get("X-Netics-Signature"), secret)) {
    return new Response("bad signature", { status: 400 });
  }

  let delivery: { event?: string; data?: unknown };
  try {
    delivery = JSON.parse(rawBody);
  } catch {
    return new Response("bad payload", { status: 400 });
  }

  const event = request.headers.get("X-Netics-Event") ?? delivery.event ?? "unknown";

  // Deliveries retry up to 5 times on any non-2xx, so handlers added here must
  // be idempotent — the same event can arrive more than once.
  switch (event) {
    case "order.created":
    case "order.updated":
    case "conversation.created":
    case "message.created":
    default:
      console.info("[netics] %s", event, delivery.data);
  }

  // Any 2xx counts as delivered; acknowledge fast and do slow work elsewhere.
  return Response.json({ received: true });
}
