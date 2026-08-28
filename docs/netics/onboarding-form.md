# NETICS onboarding — Whiskey Mistress

Values to paste into **NETICS HQ → Workspaces → Whiskey Mistress → Secure
managed onboarding**. Fields appear in the order the form shows them.

---

## Sidebar — Staff reason for this onboarding

> Approved managed onboarding for Whiskey Mistress, Wuse 2 Abuja

(The placeholder currently reads "Approved onboarding for Luxe Universal
Wears" — that is another tenant's text, so this field is still empty.)

---

## 1. Business truth

### Business name
> WHISKEY MISTRESS

Already filled.

### Industry
Pick the closest option in the dropdown. In order of preference:
**Hospitality** → **Restaurants & Bars** → **Entertainment** → **Other**.
The form notes this is only a dashboard label and does not limit the agent.

### What the business does
> Whiskey Mistress is a premium nightlife destination in Wuse 2, Abuja — a
> lounge, bar and live-entertainment venue open Wednesday to Sunday from 8PM
> until late, and from 4PM on Sundays.
>
> We serve bottle service from a world-class whiskey, cognac, champagne and
> spirits list, cocktails built to order, grills off the fire, and shisha. The
> room runs curated resident-DJ line-ups, live acts and rotating themed nights.
>
> Guests reserve tables through our website, by phone or on WhatsApp. We also
> host private events — birthdays, corporate nights, product launches and
> bottle takeovers — quoted per event. Strictly 18+.

### How the business works with customers
Tick these:

- ✅ **Sells fixed products** — bottles, cocktails, food and shisha at listed prices
- ✅ **Takes appointments** — table reservations
- ✅ **Provides quoted services** — private events are quoted per event
- ✅ **Collects leads** — private-event and group enquiries
- ✅ **Handles customer support** — hours, location, bookings, general questions

Optional, tick only if you want the agent to handle it:

- ⬜ **Processes applications or claims** — job applications through the Careers page

Leave unticked: sells variable-price products, provides fixed-price services,
connects customers with providers, manages subscriptions, rents resources,
uses custom workflows.

### Products or services, one per line
> Bottle service — whiskey, cognac, champagne and spirits
> Cocktails
> Beverages and soft drinks
> Grills and small plates
> Shisha, vape and cigarettes
> Table reservations
> VIP tables and booths
> Private events and bottle takeovers
> Live entertainment and resident DJ nights

### Locations
> 3rd Floor, Nurnberger Platz, Plot 1723, Ademola Adetokunbo Crescent, Wuse 2, Abuja, Nigeria

### Customer groups
> Nights out and groups of friends
> Couples and date nights
> Birthday and celebration parties
> Corporate and client hosting
> Private event organisers
> Job applicants

### Business terminology (one `term: meaning` per line)
> Bottle service: a full bottle bought to the table, served with mixers and ice
> Liquid Assets: our name for the drinks menu
> Claims: our name for table reservations
> The Vibe: our name for the atmosphere and themed nights
> Live Acts: performances, resident DJs and guest hosts
> One Night Only: the Sunday session, Afro-Calypso, Dancehall and Bashment, hosted by DJ Kenny
> Paradiso: a recurring Saturday themed night
> Delilah: a recurring themed night
> Daughters of Eve: a recurring themed night
> Puffs: shisha, vape and cigarettes
> Doors: the time we open, 8PM on event nights

### Policies and non-negotiable rules
> Strictly 18+. Valid ID may be requested at the door.
> All prices are in naira and exclude a 5% service charge and 7.5% VAT, which are added to the bill. Always state this when quoting a price.
> Prices are subject to change. The menu on the website is the source of truth.
> A reservation request is not a confirmed table. Only our team confirms a booking — never confirm one on our behalf.
> Never quote a VIP table minimum spend. It varies by night and the team confirms it.
> Private events are quoted per event. Never estimate a price.
> Never promise that a specific DJ, act or themed night will appear on a future date unless the team has confirmed it.
> Never offer a discount, comp or free item.
> Do not discuss salary, make an offer or promise an interview to a job applicant.
> Complaints, refunds, incidents, lost property and safety concerns go to a person immediately.
> If a question is not covered by our uploaded knowledge, say so plainly and offer to connect the guest to the team on WhatsApp +234 809 172 9999.

### Customer-facing tone
Leave as **Use the default**, or if a custom tone is offered:
> Warm, confident and concise. Premium but never stiff or over-familiar. Match
> the guest's language, including Nigerian English and Pidgin. No hard selling.

### Current business goals
> Fill tables Wednesday to Sunday, especially Friday and Saturday.
> Capture every reservation request that arrives after hours, when nobody is on the phone.
> Convert private-event and bottle-takeover enquiries into quoted bookings.
> Answer hours, location, menu and price questions instantly so staff are not repeating them.
> Grow the Sunday One Night Only session.

Then press **Save and publish profile**.

---

## 2. Knowledge base

Upload **`docs/netics/knowledge-base.md`** from this repo.

You can also press **Read the website** and point it at
`https://whiskeymistress.vercel.app` — the menu, hours, address and events are
all published there, so the two sources agree.

⚠️ Read the *Open questions* section at the end of the knowledge base first.
Three details (phone number, Instagram handle, email address) are contradictory
or unverified in the venue's own material, and the agent will repeat whatever
you upload.

---

## 3. Catalogue

The venue sells 41 listed items. Two options:

### Option A — Catalogue feed (recommended)
Paste this into **Catalogue feed** and press *Save feed*:

> https://whiskeymistress.vercel.app/products.json

The site now serves its whole menu at that URL in Shopify's `/products.json`
shape, generated from the same CMS data as the website. NETICS re-checks it
nightly at 3am, so a price changed in the dashboard reaches the agent without
anyone retyping it.

### Option B — enter items by hand
If the feed is not accepted, the highest-value items to enter first are the
ones guests ask the price of:

| Name | Price (NGN) | Category |
| --- | --- | --- |
| Glenfiddich 23yrs | 1100000 | Whiskey |
| Hennessy X.O | 890000 | Cognac |
| Dom Perignon Brut | 1100000 | Bubbly |
| Don Julio 1942 | 990000 | Spirits |
| Goat Thigh | 26300 | Grills |
| Lamb Chops | 24500 | Grills |
| Whiskey Long Island | 12500 | Cocktails |
| Whiskey Sour | 7500 | Cocktails |
| Shisha | 20000 | Puffs |

Full list: section 3 of the knowledge base.

---

## 4. Website agent

| Field | Value |
| --- | --- |
| **Agent name** | `Whiskey Mistress Front Desk` |
| **Widget title** | `Ask Whiskey Mistress` |
| **Exact website origin** | `https://whiskeymistress.vercel.app` |
| **Brand colour** | `#D4AF37` |
| **Brand gradient** | Solid brand colour only |
| **Position** | **Bottom left** |

### Welcome message
> Welcome to Whiskey Mistress. Ask me about tables, the menu, tonight's
> line-up or private events — I'll answer from what the team has published.

### Why bottom left, not bottom right
The site already has a floating stack in the **bottom-right** corner — a
reserve button, a WhatsApp button and back-to-top. A launcher at bottom right
would sit on top of them. Bottom left is clear.

### About the origin
The field takes no path or wildcard, and preview and production domains must be
added deliberately. Add each origin you want the widget to run on:

- `https://whiskeymistress.vercel.app` — current production
- the custom domain, once it is live
- `http://localhost:3000` — only if you want it while developing

Then **Save disabled agent** — drafts stay offline until handover, which is
what you want while the knowledge base is still being confirmed.

---

## Handover readiness

| Check | How it is satisfied |
| --- | --- |
| Business profile published | Step 1 above, then *Save and publish profile* |
| Customer knowledge ready | Upload `knowledge-base.md` in step 2 |
| Website agent configured | Step 4, then *Save disabled agent* |
| Catalogue imported (optional) | The feed URL in step 3 |
| No fabricated customer identity | ✅ already passing |

Then **Mark ready for owner**.

---

## Embedding the widget

Once the agent is live, add it to the site. In
`src/app/(site)/layout.tsx`, before the closing tag:

```html
<script src="https://business.neticsai.com/embed/netics-agent.js" async></script>
<netics-agent agent-id="agent_XXXX" position="bottom-left" primary-color="#D4AF37" title="Ask Whiskey Mistress"></netics-agent>
```

`agent-id` comes from AI Studio and is a public identifier, safe to commit. If
the widget does not appear, the origin is not on the allow-list, the agent is
disabled, or `api-base` is wrong — the browser console names which.

Say the word and I'll wire it in.
