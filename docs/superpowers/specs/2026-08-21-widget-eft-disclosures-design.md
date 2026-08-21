# Widget EFT-Only Disclosures — Public Documentation Design

**Date:** 2026-08-21
**Status:** Approved for implementation
**Repo:** `zbd-docs`
**Branch:** `docs/widget-eft-disclosures`
**Backend work item:** `platform-accounts-service#248`
**Companion backend spec:** `platform-accounts-service/docs/superpowers/specs/2026-08-21-widget-eft-disclosures-design.md` on `feat/widget-eft-disclosures`

## Outcome

The public widget documentation teaches one clear disclosure contract:

- widget disclosure APIs expose and record only Electronic Funds Transfer
  (EFT, type `6`);
- ZBD Terms of Service (type `2`) and Privacy Policy (type `3`) are handled by
  ZBD-owned product flows, not by the publisher through widget endpoints; and
- exact disclosure requirements depend on the partner's contract and the
  services used. ACH cashout requires the current EFT disclosure.

The docs must not imply that widget-user creation automatically accepts any
document or that opening a widget session records acceptance.

## Source contract

The backend behavior is owned by the companion `platform-accounts-service`
spec. Public examples are updated alongside that implementation and must not be
merged as a promise ahead of the backend rollout without coordination.

The relevant widget surfaces are:

- `POST /api/v1/widget/users`
- `POST /api/v1/cashout/sandbox/users`
- `GET /api/v1/widget/users/{userId}/disclosures`
- `POST /api/v1/widget/users/{userId}/disclosures`
- `GET /api/v2/session/me`

All of their disclosure status output is EFT-only. The submit route filters its
input to type `6`; other submitted IDs are ignored and are not recorded.

## Core language

Use the following sentence anywhere the docs need the applicability caveat:

> Exact disclosure types required depend on your contract and the services you use.

The owner page should explain the user journey in plain language:

1. Create or resolve the widget user.
2. Read the outstanding EFT disclosure from user creation or the disclosure
   status endpoint.
3. If EFT applies to the integration, present the linked document outside the
   widget and collect the user's explicit acceptance.
4. Submit type `6` from the partner backend.
5. Open the widget session and proceed. ACH cashout remains blocked until the
   current EFT version is accepted.

The docs should distinguish reporting from enforcement. User creation and
`/api/v2/session/me` report outstanding EFT; they do not auto-accept it. The
transaction cashout path owns the actual ACH enforcement.

## Page changes

### `widget/disclosures.mdx` — canonical owner

- Make EFT/type `6` the only widget disclosure type.
- State directly that ZBD Terms and Privacy are not accepted through widget
  endpoints.
- Keep the versioning explanation: a newly published EFT version can become
  outstanding after an older version was accepted.
- Update the end-to-end flow to be conditional on EFT applicability rather than
  claiming every session requires Terms/Privacy acceptance.
- Replace the session-status example with an EFT/type-`6` entry.
- Explain that an empty array means there is no outstanding widget-supported
  disclosure, not that the user has accepted every disclosure in every ZBD
  product.
- Document backward compatibility: the submit endpoint considers only type `6`.
  Other IDs are ignored and not recorded; the response reports only supported
  IDs actually considered.
- Retain the server-side API-key warning and the sandbox guidance.

### `widget/create-user.mdx`

- Describe `outstanding_disclosures` as widget-supported EFT status.
- Change the response example from Terms/type `2` to EFT/type `6`.
- Avoid saying every returned disclosure must be completed before session
  creation; link to the owner page for applicability and enforcement.

### `widget/get-disclosure-status.mdx`

- Say the endpoint returns the current EFT status, not every disclosure type.
- Return a single type-`6` example.
- Define `tos_current` in terms of the current EFT version while retaining the
  existing response field name.

### `widget/submit-disclosure-acceptance.mdx`

- Make type `6` the sole documented request value.
- Remove types `2` and `3` from the widget disclosure table.
- State that unsupported IDs are ignored and not recorded, including the
  backward-compatible `[2, 3, 6]` to `[6]` behavior.
- Update the error table: a missing or empty array remains invalid; an
  unsupported non-empty list is a successful no-op rather than an unknown-type
  error.

### `widget/create-session.mdx`

- Remove the instruction that the publisher must accept ZBD Terms and Privacy
  before session creation.
- State that the session can report outstanding EFT but does not render or
  collect it.
- Point to the owner page for the service/contract applicability rule and ACH
  enforcement.

### `widget.mdx`

- Replace the broad Terms/Privacy wording with a short link to the owner page.
- State that the publisher presents and records applicable widget disclosures
  outside the iframe and that exact requirements depend on contract/services.

No navigation changes are needed because all pages already exist in
`docs.json`.

## Examples and field stability

Keep existing routes and JSON field names. In particular:

- request field: `acceptedDisclosureTypeIds`;
- status field: `tos_current` (even though the widget-supported document is EFT);
- create/session field: `outstanding_disclosures`; and
- success status for submit: `201`.

Examples must use the latest-document concept without promising a fixed EFT
version, disclosure row ID, URI, or deployment date. A representative `1.0.0`
example is acceptable only as illustrative data.

## Validation

- Search the widget docs for type `2`, type `3`, Terms of Service, and Privacy
  Policy; no remaining text may tell a publisher to accept them through widget
  APIs.
- Search all examples to ensure widget disclosure entries use type `6`.
- Confirm all edited internal links still resolve and the pages remain listed in
  `docs.json`.
- Run the available Mintlify validation/preview workflow from the repository
  root and inspect the edited pages in the generated PR preview.
- Reconcile `zbd-widget-docs` owner documentation against the implemented
  backend after the code change, following its README ownership and validation
  rules. That internal context update is not a substitute for this public API
  documentation.

## Rollout coordination

The public docs and backend should be reviewed together. The backend remains
compatible with deployed partner payloads by ignoring types `2` and `3`, so
partners do not face an immediate breaking request failure. The docs establish
the forward contract: new and updated integrations submit only `[6]`.

## Out of scope

- Documenting the ZBD mobile-wallet Terms/Privacy UI.
- Changing generic ZBD disclosure documentation outside the widget section.
- Adding a new API endpoint or renaming response fields.
- Promising that EFT applies to non-ACH cashout rails.
- Publishing disclosure content or calling the admin disclosure endpoint.
