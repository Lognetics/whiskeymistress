import Script from "next/script";

/**
 * The NETICS website agent.
 *
 * `agent-id` is a public identifier and safe to ship to the browser; the
 * `nk_` API key is server-side only and never reaches this component. The
 * widget refuses to start unless the page's exact origin is on the agent's
 * allow-list in AI Studio.
 *
 * Positioned bottom-left because <FloatingActions /> already occupies the
 * bottom-right corner with the reserve, WhatsApp and back-to-top buttons.
 */

/**
 * `netics-agent` is a custom element, not a React component. Typing it this
 * way keeps the hyphenated attributes checked without augmenting the global
 * JSX namespace.
 */
const NeticsElement = "netics-agent" as unknown as React.FC<{
  "agent-id": string;
  "api-base"?: string;
  position?: string;
  "primary-color"?: string;
  title?: string;
  placeholder?: string;
}>;

export function NeticsAgent() {
  const agentId = process.env.NEXT_PUBLIC_NETICS_AGENT_ID;
  if (!agentId) return null;

  const apiBase =
    process.env.NEXT_PUBLIC_NETICS_API_BASE ?? "https://business.neticsai.com";

  return (
    <>
      <Script src={`${apiBase}/embed/netics-agent.js`} strategy="lazyOnload" />
      <NeticsElement
        agent-id={agentId}
        api-base={apiBase}
        position="bottom-left"
        primary-color="#D4AF37"
        title="Ask Whiskey Mistress"
        placeholder="Tables, menu, tonight's line-up…"
      />
    </>
  );
}
