# Navigation restructuring map

How every page on `docs.zbdpay.com` changes when the content and tab structure from
`zbdpay-docs` is applied to this repo. The stack does not change — this stays Mintlify
(`"theme": "mint"`), bare paths, no `/docs` prefix.

**Source of truth:** `zbdpay-docs` @ `content/docs` · **Target:** `zbd-docs` @ `feature/updated-docs`

## At a glance

| | Pages |
|---|---|
| Live today | 192 |
| Carried over | 121 |
| — of those, byte-identical | 45 |
| — of those, substantially rewritten | 13 |
| **Abandoned (will 404)** | **71** |
| Brand-new, no predecessor | 56 |
| **Total after restructure** | **177** |

Every current URL changes. There is no page that keeps its path: the four tabs
(Getting Started / Earn / Pay / Widgets) become six, and every top-level prefix is rewritten.

## Status

**Applied.** The restructure is in the working tree of `feature/updated-docs` and verified against a local
Mintlify build: all 177 pages return 200, all 121 carried-over URLs redirect to the right destination,
and the abandoned URLs 404 as agreed. Uncommitted.

## Decisions already taken

1. **URLs stay prefix-free.** New paths are `/bitcoin/...`, `/embedded-accounts/...` — no `/docs` segment.
2. **The abandoned sections are not carried over.** They are listed here for the record only.
3. **Abandoned URLs are left to 404 for now.** No catch-all redirect. Each will be decided individually — see [Abandoned pages](#abandoned-pages).

## Tab structure

### Before — 4 tabs

```
Getting Started   Build with ZBD · Set Up ZBD · Products · Knowledge Base
Earn              Earn SDK
Pay               Overview · Payments SDK · Payments API · Onramps · Login with ZBD
Widgets           ZBD Widget
```

### After — 6 tabs

```
Embedded Accounts      Concepts · Moving value · Cashing out · API      (new product)
Embedded Payouts       Concepts · Paying out · Integration · API       (was: Widgets)
Embedded Rewards       Concepts · Setup · ... · API Reference          (was: Earn › Earn SDK)
Bitcoin                Overview · Lightning * · Payments Overview · Set Up ZBD
                                                        (was: Pay › Payments API + Overview, Getting Started)
Business operations    (new)
Development resources  (new)
```

### Section-level moves

| Old section | New tab | Path rule |
|---|---|---|
| Pay › Payments API | Bitcoin | `/payments/api/*` → `/bitcoin/*` |
| Pay › Payments API › Resources | Bitcoin › Overview | `/payments/api/resources/*` → `/bitcoin/resources/*` |
| Pay › Overview + guides | Bitcoin › Payments Overview | `/payments/*` → `/bitcoin/payments/*` |
| Getting Started › Set Up ZBD | Bitcoin › Set Up ZBD | `/get-started/*` → `/bitcoin/start/*` |
| Earn › Earn SDK | Embedded Rewards | `/earn/sdk/*` → `/embedded-rewards/*` |
| Widgets › ZBD Widget | Embedded Payouts | `/widget/*` → `/embedded-payouts/apis/*` |
| — | Embedded Accounts | new product, 37 pages |
| — | Business operations, Development resources | new, 4 pages |

Two Widget endpoints cross into a **different product**: disclosure handling moves from
Payouts to Embedded Accounts. Those are called out in the table below.

## Page-by-page map

`=` byte-identical · `~` edited · `!` substantially rewritten (<50% similar — review the new copy before publishing)

### Getting Started

| | Current URL | New URL |
|---|---|---|
| `~` | `/get-started/add-funds` | `/bitcoin/start/add-funds` |
| `~` | `/get-started/api-keys` | `/bitcoin/start/api-keys` |
| `~` | `/get-started/create-account` | `/bitcoin/start/create-account` |
| `!` | `/get-started/create-project` | `/bitcoin/start/create-project` |
| `~` | `/get-started/dev-dashboard` | `/bitcoin/start/dev-dashboard` |
| `~` | `/get-started/manage-project` | `/bitcoin/start/manage-project` |
| `~` | `/get-started/project-wallet` | `/bitcoin/start/project-wallet` |
| `~` | `/get-started/sandbox-project` | `/bitcoin/start/sandbox-project` |
| `=` | `/get-started/verify-identity` | `/bitcoin/start/verify-identity` |

### Pay › Overview

| | Current URL | New URL |
|---|---|---|
| `~` | `/payments` | `/bitcoin/payments` |
| `~` | `/payments/coverage` | `/bitcoin/payments/coverage` |
| `=` | `/payments/glossary` | `/bitcoin/payments/glossary` |
| `!` | `/payments/integrations` | `/bitcoin/payments/integrations` |
| `~` | `/payments/knowledge-base` | `/bitcoin/payments/knowledge-base` |
| `~` | `/payments/lightning-address` | `/bitcoin/payments/lightning-address` |
| `=` | `/payments/lightning-address/intro` | `/bitcoin/payments/lightning-address/intro` |
| `~` | `/payments/lightning-address/static-charges` | `/bitcoin/payments/lightning-address/static-charges` |
| `~` | `/payments/lightning-network` | `/bitcoin/payments/lightning-network` |
| `~` | `/payments/mcp` | `/bitcoin/payments/mcp` |
| `~` | `/payments/nostr/nostr-relay` | `/bitcoin/payments/nostr/nostr-relay` |
| `=` | `/payments/openapi` | `/bitcoin/payments/openapi` |
| `~` | `/payments/payins/gamertags` | `/bitcoin/payments/payins/gamertags` |
| `~` | `/payments/payins/lightning-charges` | `/bitcoin/payments/payins/lightning-charges` |
| `=` | `/payments/payouts/gamertags` | `/bitcoin/payments/payouts/gamertags` |
| `~` | `/payments/payouts/lightning-address` | `/bitcoin/payments/payouts/lightning-address` |
| `~` | `/payments/payouts/lightning-charges` | `/bitcoin/payments/payouts/lightning-charges` |
| `~` | `/payments/payouts/withdrawal-requests` | `/bitcoin/payments/payouts/withdrawal-requests` |
| `~` | `/payments/replit` | `/bitcoin/payments/replit` |
| `=` | `/payments/templates` | `/bitcoin/payments/templates` |

### Pay › Payments API

| | Current URL | New URL |
|---|---|---|
| `~` | `/payments/api` | `/bitcoin` |
| `~` | `/payments/api/callbacks` | `/bitcoin/callbacks` |
| `=` | `/payments/api/errors` | `/bitcoin/errors` |
| `=` | `/payments/api/gamertags` | `/bitcoin/gamertags` |
| `~` | `/payments/api/gamertags/create-charge` | `/bitcoin/gamertags/create-charge` |
| `~` | `/payments/api/gamertags/retrieve-from-userid` | `/bitcoin/gamertags/retrieve-from-userid` |
| `~` | `/payments/api/gamertags/retrieve-payment` | `/bitcoin/gamertags/retrieve-payment` |
| `=` | `/payments/api/gamertags/retrieve-userid` | `/bitcoin/gamertags/retrieve-userid` |
| `=` | `/payments/api/gamertags/sandbox/send` | `/bitcoin/gamertags/sandbox/send` |
| `~` | `/payments/api/gamertags/send` | `/bitcoin/gamertags/send` |
| `=` | `/payments/api/keysend` | `/bitcoin/keysend` |
| `~` | `/payments/api/keysend/send` | `/bitcoin/keysend/send` |
| `~` | `/payments/api/lightning-address` | `/bitcoin/lightning-address` |
| `=` | `/payments/api/lightning-address/create-charge` | `/bitcoin/lightning-address/create-charge` |
| `=` | `/payments/api/lightning-address/send` | `/bitcoin/lightning-address/send` |
| `~` | `/payments/api/lightning-address/validate` | `/bitcoin/lightning-address/validate` |
| `~` | `/payments/api/lightning-charges` | `/bitcoin/lightning-charges` |
| `~` | `/payments/api/lightning-charges/create` | `/bitcoin/lightning-charges/create` |
| `~` | `/payments/api/lightning-charges/create-static` | `/bitcoin/lightning-charges/create-static` |
| `=` | `/payments/api/lightning-charges/decode` | `/bitcoin/lightning-charges/decode` |
| `=` | `/payments/api/lightning-charges/retrieve` | `/bitcoin/lightning-charges/retrieve` |
| `=` | `/payments/api/lightning-charges/retrieve-static` | `/bitcoin/lightning-charges/retrieve-static` |
| `=` | `/payments/api/lightning-charges/update-static` | `/bitcoin/lightning-charges/update-static` |
| `=` | `/payments/api/lightning-payments` | `/bitcoin/lightning-payments` |
| `=` | `/payments/api/lightning-payments/retrieve` | `/bitcoin/lightning-payments/retrieve` |
| `~` | `/payments/api/lightning-payments/send` | `/bitcoin/lightning-payments/send` |
| `=` | `/payments/api/resources/openapi` | `/bitcoin/resources/openapi` |
| `~` | `/payments/api/resources/overview` | `/bitcoin/resources/overview` |
| `=` | `/payments/api/resources/postman` | `/bitcoin/resources/postman` |
| `=` | `/payments/api/utils` | `/bitcoin/utils` |
| `=` | `/payments/api/utils/btc-usd` | `/bitcoin/utils/btc-usd` |
| `=` | `/payments/api/utils/ip` | `/bitcoin/utils/ip` |
| `=` | `/payments/api/utils/is-supported-region` | `/bitcoin/utils/is-supported-region` |
| `=` | `/payments/api/wallet` | `/bitcoin/wallet` |
| `=` | `/payments/api/wallet/internal-transfer` | `/bitcoin/wallet/internal-transfer` |
| `=` | `/payments/api/wallet/retrieve-balance` | `/bitcoin/wallet/retrieve-balance` |
| `=` | `/payments/api/withdrawal-requests` | `/bitcoin/withdrawal-requests` |
| `=` | `/payments/api/withdrawal-requests/create` | `/bitcoin/withdrawal-requests/create` |
| `=` | `/payments/api/withdrawal-requests/retrieve` | `/bitcoin/withdrawal-requests/retrieve` |

### Earn › Earn SDK

| | Current URL | New URL |
|---|---|---|
| `~` | `/earn/coverage` | `/embedded-rewards/coverage` |
| `~` | `/earn/sdk` | `/embedded-rewards` |
| `=` | `/earn/sdk/android-app-store` | `/embedded-rewards/android-app-store` |
| `=` | `/earn/sdk/attestation-setup` | `/embedded-rewards/attestation-setup` |
| `~` | `/earn/sdk/best-practices` | `/embedded-rewards/best-practices` |
| `~` | `/earn/sdk/building` | `/embedded-rewards/building` |
| `=` | `/earn/sdk/compatibility` | `/embedded-rewards/compatibility` |
| `=` | `/earn/sdk/create-api-key` | `/embedded-rewards/create-api-key` |
| `~` | `/earn/sdk/creatives` | `/embedded-rewards/creatives` |
| `~` | `/earn/sdk/customization` | `/embedded-rewards/customization` |
| `~` | `/earn/sdk/delete-blocklist-entry` | `/embedded-rewards/delete-blocklist-entry` |
| `=` | `/earn/sdk/download` | `/embedded-rewards/download` |
| `~` | `/earn/sdk/error-handling` | `/embedded-rewards/error-handling` |
| `~` | `/earn/sdk/get-blocklist-entries` | `/embedded-rewards/get-blocklist-entries` |
| `=` | `/earn/sdk/gift-cards` | `/embedded-rewards/gift-cards` |
| `~` | `/earn/sdk/go-live-checklist` | `/embedded-rewards/go-live-checklist` |
| `~` | `/earn/sdk/integration` | `/embedded-rewards/integration` |
| `=` | `/earn/sdk/ios-app-store` | `/embedded-rewards/ios-app-store` |
| `=` | `/earn/sdk/list-api-keys` | `/embedded-rewards/list-api-keys` |
| `~` | `/earn/sdk/local-notifications` | `/embedded-rewards/local-notifications` |
| `~` | `/earn/sdk/manage-controls-dashboard` | `/embedded-rewards/manage-controls-dashboard` |
| `=` | `/earn/sdk/manage-rewards-balance` | `/embedded-rewards/manage-rewards-balance` |
| `=` | `/earn/sdk/manage-user-linking` | `/embedded-rewards/manage-user-linking` |
| `~` | `/earn/sdk/manage-via-dashboard` | `/embedded-rewards/manage-via-dashboard` |
| `~` | `/earn/sdk/manage-withdrawal-limits` | `/embedded-rewards/manage-withdrawal-limits` |
| `~` | `/earn/sdk/mmp-postbacks` | `/embedded-rewards/mmp-postbacks` |
| `~` | `/earn/sdk/planning` | `/embedded-rewards/planning` |
| `~` | `/earn/sdk/player-comms` | `/embedded-rewards/player-comms` |
| `~` | `/earn/sdk/restrict-client-rewards` | `/embedded-rewards/restrict-client-rewards` |
| `~` | `/earn/sdk/revenue-based-earning` | `/embedded-rewards/revenue-based-earning` |
| `=` | `/earn/sdk/revoke-api-key` | `/embedded-rewards/revoke-api-key` |
| `~` | `/earn/sdk/reward-economics` | `/embedded-rewards/reward-economics` |
| `~` | `/earn/sdk/security` | `/embedded-rewards/security` |
| `=` | `/earn/sdk/send-rewards-api` | `/embedded-rewards/send-rewards-api` |
| `~` | `/earn/sdk/send-rewards-client` | `/embedded-rewards/send-rewards-client` |
| `~` | `/earn/sdk/send-rewards-server` | `/embedded-rewards/send-rewards-server` |
| `~` | `/earn/sdk/soft-currency` | `/embedded-rewards/soft-currency` |
| `=` | `/earn/sdk/support-data` | `/embedded-rewards/support-data` |
| `~` | `/earn/sdk/troubleshoot` | `/embedded-rewards/troubleshoot` |
| `=` | `/earn/sdk/url-scheme` | `/embedded-rewards/url-scheme` |
| `~` | `/earn/sdk/user-balance` | `/embedded-rewards/user-balance` |
| `~` | `/earn/sdk/withdrawal-events` | `/embedded-rewards/withdrawal-events` |

### Widgets

| | Current URL | New URL |
|---|---|---|
| `!` | `/widget` | `/embedded-payouts` |
| `!` | `/widget/create-session` | `/embedded-payouts/apis/create-session` |
| `!` | `/widget/create-user` | `/embedded-payouts/apis/create-user` |
| `!` | `/widget/deplete-user` | `/embedded-payouts/apis/deplete-user` |
| `!` | `/widget/fund-user` | `/embedded-payouts/apis/fund-user` |
| `!` | `/widget/get-balance` | `/embedded-payouts/apis/get-balance` |
| `!` | `/widget/get-disclosure-status` | `/embedded-accounts/apis/get-disclosures` ⚠️ moves to Embedded Accounts |
| `!` | `/widget/get-transactions` | `/embedded-payouts/apis/list-user-transactions` |
| `!` | `/widget/get-user` | `/embedded-payouts/apis/get-user` |
| `!` | `/widget/submit-disclosure-acceptance` | `/embedded-accounts/apis/record-disclosures` ⚠️ moves to Embedded Accounts |
| `!` | `/widget/update-user` | `/embedded-payouts/apis/update-user` |

## Abandoned pages

**71 pages.** Not carried over, and left to 404 pending a per-section decision.
Grouped by the section they belong to.

### Onramps / ZBD Ramp — 14 pages

| Current URL | Title |
|---|---|
| `/payments/ramp` | ZBD Ramp |
| `/payments/ramp/ai-themes` | AI-Generated Themes |
| `/payments/ramp/emails` | Email Receipts |
| `/payments/ramp/faq` | Frequently Asked Questions |
| `/payments/ramp/platform` | Platform Details |
| `/payments/ramp/quickstart` | Integration Guide |
| `/payments/ramp/sdks/flutter` | Flutter SDK |
| `/payments/ramp/sdks/react` | React SDK |
| `/payments/ramp/sdks/react-native` | React Native SDK |
| `/payments/ramp/sdks/typescript` | TypeScript SDK |
| `/payments/ramp/session` | Create Ramp Session |
| `/payments/ramp/themes` | Themes Customization |
| `/payments/ramp/user-flow` | User Flow Walkthrough |
| `/payments/ramp/webhooks` | Webhook Events |

### Payments SDK — 13 pages

| Current URL | Title |
|---|---|
| `/payments/sdk` | ZBD Payments SDK |
| `/payments/sdk/csharp` | C# SDK |
| `/payments/sdk/go` | Go SDK |
| `/payments/sdk/http` | HTTP |
| `/payments/sdk/rust` | Rust SDK |
| `/payments/sdk/typescript` | TypeScript SDK |
| `/payments/sdk/typescript/express` | Express |
| `/payments/sdk/typescript/next` | Next.js |
| `/payments/sdk/typescript/node` | Node.js |
| `/payments/sdk/typescript/supabase/receive` | Receiving instant Bitcoin payments with Supabase |
| `/payments/sdk/typescript/supabase/send` | Sending instant Bitcoin payments with Supabase |
| `/payments/sdk/typescript/vercel/receive` | Receiving instant Bitcoin payments on Vercel |
| `/payments/sdk/typescript/vercel/send` | Sending instant Bitcoin payments on Vercel |

### Login with ZBD — 15 pages

| Current URL | Title |
|---|---|
| `/earn/oauth2` | Introduction |
| `/earn/oauth2/advanced` | Advanced OAuth2 |
| `/earn/oauth2/api` | Overview |
| `/earn/oauth2/api/authorization` | Authorization |
| `/earn/oauth2/api/data-fetching` | Data Fetching |
| `/earn/oauth2/api/refresh-token` | Refresh Token |
| `/earn/oauth2/api/retrieve-access-token` | Fetch Access Token |
| `/earn/oauth2/api/retrieve-user` | Get User Data |
| `/earn/oauth2/api/retrieve-wallet` | Get Wallet Data |
| `/earn/oauth2/guidelines` | Guidelines |
| `/earn/oauth2/integration` | Integrating |
| `/earn/oauth2/integrations/better-auth` | ZBD Login with BetterAuth |
| `/earn/oauth2/integrations/intro` | ZBD Login with Next.js through NextAuth.js |
| `/earn/oauth2/integrations/next-auth` | ZBD Login with Next.js through NextAuth.js |
| `/earn/oauth2/walkthrough` | Implementation Walkthrough |

### Earn Knowledge Base — 14 pages

| Current URL | Title |
|---|---|
| `/earn/knowledge-base` | Knowledge Base |
| `/earn/knowledge-base/game-security` | Introduction |
| `/earn/knowledge-base/game-security/altering-network-traffic` | 5. Altering Network Traffic |
| `/earn/knowledge-base/game-security/app-check` | Detecting fake devices and apps |
| `/earn/knowledge-base/game-security/decompiling-source-code` | 4. Decompiling Source Code |
| `/earn/knowledge-base/game-security/hacking-memory-values` | 3. Hacking Memory Values |
| `/earn/knowledge-base/game-security/hacking-saved-game` | 2. Hacking Saved Game Data |
| `/earn/knowledge-base/game-security/insecure-game` | 1. An Insecure Game |
| `/earn/knowledge-base/game-security/replay-attacks` | Replay/Mirror Attacks |
| `/earn/knowledge-base/game-security/securing-data` | Securing data sent to the server |
| `/earn/knowledge-base/game-security/securing-game` | Making A More Secure Game |
| `/earn/knowledge-base/integrations/unity` | OAuth2 Login with ZBD in Unity |
| `/earn/knowledge-base/rewarded-play` | Introduction to Rewarded Play |
| `/earn/knowledge-base/rewarded-play/integrating` | Integrating Player Rewards in a Game |

### ZBD App — 2 pages

| Current URL | Title |
|---|---|
| `/earn/app` | ZBD App |
| `/earn/app/uri-schemes` | URI Schemes |

### Product landing pages — 6 pages

| Current URL | Title |
|---|---|
| `/get-started` | ZBD Documentation |
| `/get-started/login-with-zbd` | — |
| `/get-started/zbd-app` | ZBD App |
| `/get-started/zbd-earn-sdk` | — |
| `/get-started/zbd-payments-api` | ZBD Payments API |
| `/get-started/zbd-ramp` | ZBD Ramp |

### Misc — 3 pages

| Current URL | Title |
|---|---|
| `/payments/ai-ingestion` | AI Ingestion |
| `/payments/http` | Introduction |
| `/payments/roadmap` | Roadmap |

### No successor page — 4 pages

| Current URL | Title |
|---|---|
| `/widget/browser-events` | Browser Events |
| `/widget/disclosures` | Disclosure Agreements |
| `/widget/sandbox` | Sandbox |
| `/widget/webhooks` | Server Webhooks |

> `snippets/ramp-customization.mdx` is only used by the Onramps pages and becomes dead once they go.

## New pages with no predecessor

**56 pages** arriving with the restructure. Nothing to redirect; these are net additions.

### Business operations — 2 pages

| New URL | Title |
|---|---|
| `/business-operations/data-protection` | Data protection |
| `/business-operations/publisher-account-types` | Publisher account types |

### Development resources — 2 pages

| New URL | Title |
|---|---|
| `/development-resources/idempotency-keys` | Idempotency Keys & User ID Generation |
| `/development-resources/integrating-embedded-accounts` | Integrating Embedded Accounts |

### Embedded Accounts — 35 pages

| New URL | Title |
|---|---|
| `/embedded-accounts/accounts-and-balances` | Accounts and balances |
| `/embedded-accounts/apis/create-currency` | Create a currency |
| `/embedded-accounts/apis/create-player` | Create a player |
| `/embedded-accounts/apis/create-session` | Create a session |
| `/embedded-accounts/apis/create-workspace` | Create a workspace |
| `/embedded-accounts/apis/credit-player` | Credit a player |
| `/embedded-accounts/apis/debit-player` | Debit a player |
| `/embedded-accounts/apis/delete-currency` | Delete a currency |
| `/embedded-accounts/apis/delete-player` | Delete a player |
| `/embedded-accounts/apis/delete-workspace` | Delete a workspace |
| `/embedded-accounts/apis/get-account-summary` | Get account summary |
| `/embedded-accounts/apis/get-bundle` | Get a bundle |
| `/embedded-accounts/apis/get-currency` | Get a currency |
| `/embedded-accounts/apis/get-publisher-config` | Get publisher config |
| `/embedded-accounts/apis/get-session-config` | Get session config |
| `/embedded-accounts/apis/get-workspace` | Get a workspace |
| `/embedded-accounts/apis/link-currency` | Link a currency to a workspace |
| `/embedded-accounts/apis/list-bundles` | List bundles |
| `/embedded-accounts/apis/list-currencies` | List currencies |
| `/embedded-accounts/apis/list-monetary-accounts` | List monetary accounts |
| `/embedded-accounts/apis/list-player-transactions` | List player transactions |
| `/embedded-accounts/apis/list-redemption-rates` | List redemption rates |
| `/embedded-accounts/apis/list-workspaces` | List workspaces |
| `/embedded-accounts/apis/overview` | API overview |
| `/embedded-accounts/apis/send-gift` | Send a gift |
| `/embedded-accounts/apis/unlink-currency` | Unlink a currency |
| `/embedded-accounts/apis/update-currency` | Update a currency |
| `/embedded-accounts/apis/update-workspace` | Update a workspace |
| `/embedded-accounts/cash-out` | Cash outs |
| `/embedded-accounts/credits` | Credits |
| `/embedded-accounts/currencies` | Currencies |
| `/embedded-accounts` | Overview |
| `/embedded-accounts/marketplace` | Marketplace sales |
| `/embedded-accounts/spending` | Spends |
| `/embedded-accounts/transfers` | Transfers |

### Embedded Payouts — 17 pages

| New URL | Title |
|---|---|
| `/embedded-payouts/apis/cash-out-gift-card` | Cash out as a gift card |
| `/embedded-payouts/apis/cash-out-sandbox` | Cash out (sandbox) |
| `/embedded-payouts/apis/cash-out-to-bank` | Cash out to a bank account |
| `/embedded-payouts/apis/create-webhook` | Create a webhook |
| `/embedded-payouts/apis/get-cashout-limits` | Get cash-out limits |
| `/embedded-payouts/apis/get-exchange-rate` | Get exchange rate |
| `/embedded-payouts/apis/list-publisher-transactions` | List publisher transactions |
| `/embedded-payouts/apis/list-webhooks` | List webhooks |
| `/embedded-payouts/apis/overview` | API overview |
| `/embedded-payouts/apis/quote-cashout` | Quote a cash out |
| `/embedded-payouts/apis/update-webhook` | Update a webhook |
| `/embedded-payouts/cash-out-widget` | Cash out widget |
| `/embedded-payouts/funding` | Payout pools |
| `/embedded-payouts/how-payouts-work` | How payouts work |
| `/embedded-payouts/methods-and-coverage` | Payout methods |
| `/embedded-payouts/paying-out` | Paying out |
| `/embedded-payouts/users` | Users |

## Existing redirects that break

`docs.json` currently has 36 redirects. The restructure invalidates all of them:
their destinations either move or disappear. These are **redirect chains from the pre-2024 URL scheme**,
so leaving them broken silently 404s old inbound links.

### Re-point — 19

| Source | Old destination | New destination |
|---|---|---|
| `/docs/openapi` | `/payments/api/resources/openapi` | `/bitcoin/resources/openapi` |
| `/docs/examples` | `/payments/templates` | `/bitcoin/payments/templates` |
| `/docs/integrations` | `/payments` | `/bitcoin/payments` |
| `/docs/global-support` | `/payments/coverage` | `/bitcoin/payments/coverage` |
| `/knowledge-base/payouts/zbd-gamertag` | `/payments/payouts/gamertags` | `/bitcoin/payments/payouts/gamertags` |
| `/knowledge-base/payins/charges` | `/payments/payins/lightning-charges` | `/bitcoin/payments/payins/lightning-charges` |
| `/knowledge-base/payins/zbd-gamertag` | `/payments/payins/gamertags` | `/bitcoin/payments/payins/gamertags` |
| `/knowledge-base/guides/nostr-relay` | `/payments/nostr/nostr-relay` | `/bitcoin/payments/nostr/nostr-relay` |
| `/knowledge-base/guides/*` | `/payments` | `/bitcoin/payments` |
| `/api-reference/introduction` | `/payments/api` | `/bitcoin` |
| `/earn/api` | `/earn/sdk` | `/embedded-rewards` |
| `/earn/api/gamertags` | `/earn/sdk` | `/embedded-rewards` |
| `/earn/api/gamertags/:slug*` | `/earn/sdk` | `/embedded-rewards` |
| `/earn/sdk/fraud-prevention` | `/earn/sdk/security` | `/embedded-rewards/security` |
| `/earn/sdk/withdrawal-limits` | `/earn/sdk/revenue-based-earning` | `/embedded-rewards/revenue-based-earning` |
| `/earn/sdk/user-withdrawal` | `/earn/sdk/user-balance` | `/embedded-rewards/user-balance` |
| `/earn/sdk/increase-withdrawal-limit` | `/earn/sdk/manage-withdrawal-limits` | `/embedded-rewards/manage-withdrawal-limits` |
| `/earn/sdk/decrease-withdrawal-limit` | `/earn/sdk/manage-withdrawal-limits` | `/embedded-rewards/manage-withdrawal-limits` |
| `/earn/sdk/intro` | `/earn/sdk` | `/embedded-rewards` |

### Broken — 17

These point at pages that no longer exist. They need a decision alongside the abandoned sections.

| Source | Old destination | Problem |
|---|---|---|
| `/docs/introduction` | `/get-started` | destination abandoned |
| `/docs/nodejs-quickstart` | `/payments/sdk/node` | destination not resolvable (wildcard or already stale) |
| `/docs/nextjs-quickstart` | `/payments/sdk/typescript/next` | destination abandoned |
| `/docs/express-quickstart` | `/payments/sdk/typescript/express` | destination abandoned |
| `/docs/vercel-edge-functions/send` | `/payments/sdk/typescript/vercel/send` | destination abandoned |
| `/docs/vercel-edge-functions/receive` | `/payments/sdk/typescript/vercel/receive` | destination abandoned |
| `/docs/supabase-edge-functions/send` | `/payments/sdk/typescript/supabase/send` | destination abandoned |
| `/docs/supabase-edge-functions/receive` | `/payments/sdk/typescript/supabase/receive` | destination abandoned |
| `/docs/csharp-quickstart` | `/payments/sdk/csharp` | destination abandoned |
| `/docs/go-quickstart` | `/payments/sdk/go` | destination abandoned |
| `/docs/replit-quickstart` | `/payments/sdk` | destination abandoned |
| `/docs/sdk` | `/payments/sdk` | destination abandoned |
| `/courses/*` | `/get-started` | destination abandoned |
| `/knowledge-base/payouts/:slug*` | `/payments/payouts/:slug*` | destination not resolvable (wildcard or already stale) |
| `/rewards/:slug*` | `/earn/:slug*` | destination not resolvable (wildcard or already stale) |
| `/rewards` | `/earn` | destination not resolvable (wildcard or already stale) |
| `/earn/knowledge-base/integrations/beamable` | `/earn/knowledge-base/integrations/unity` | destination abandoned |

## Component conversions applied

The incoming content used three components with no Mintlify equivalent. All three are resolved:

| Component | Uses | Resolution |
|---|---|---|
| `<ApiEndpointDoc id="…">` | 46 | Expanded at migration time into the endpoint's purpose plus an auth `<ParamField>`, generated from `lib/api-surface.ts`. The pages already carried Mintlify-shaped `api:` frontmatter, so Mintlify renders its native API playground (method badge, path, **Try it**, cURL panel) around the generated body. |
| `<Mermaid chart={`…`}>` | 6 | Converted to fenced ` ```mermaid ` blocks, which Mintlify renders natively. |
| `<ApiOverview product="…">` | 2 | Expanded into a static endpoint table plus the conventions and limitations lists, from the same `api-surface.ts` data. |

Everything else in the incoming MDX was already Mintlify vocabulary and copied across untouched.

## Other migration notes

- **Internal links were `/docs/`-prefixed** in the source repo (194 links, 76 distinct targets). All rewritten to bare paths to match this repo's URL scheme.
- **Folder landing pages** moved from `X/index.mdx` to `X.mdx`, matching Mintlify's convention.
- **`widget-tab.js` / `widget-tab.css`** are now dead — they existed to hide the Widgets tab on non-widget routes, and that tab no longer exists. Not referenced from `docs.json`; safe to delete.
- **`snippets/ramp-customization.mdx`** deleted with the Onramps pages. `snippets/footer.mdx` survives but is no longer imported by any page.

## Open items

1. **Abandoned sections still need a per-URL decision** — 404, redirect to the nearest surviving parent, or restore. Login with ZBD (15 pages) and the Game Security course (14 pages) are the two substantial bodies of work involved. They 404 today, as agreed.
2. **17 pre-existing redirects are left pointing at abandoned destinations** and so resolve to 404s. They were deliberately not rewritten — they belong to the same per-URL decision as item 1. Listed under [Broken](#broken--17).
3. **Search is inactive in local preview** — `mint dev` reports `Run mint login in the cli to activate search`. Expected locally; nothing to fix in the content.
