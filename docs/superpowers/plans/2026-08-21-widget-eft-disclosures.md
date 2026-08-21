# Widget EFT-Only Disclosures Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the public widget documentation so partners submit only Electronic Funds Transfer disclosure type `6`, understand that ZBD Terms/Privacy are outside the widget contract, and can safely migrate from older payloads.

**Architecture:** Keep `widget/disclosures.mdx` as the canonical explanation and make all other widget pages link to it rather than restating the whole model. Endpoint pages retain the existing routes and JSON fields but use EFT-only examples and document that unsupported IDs are ignored. Documentation ships alongside the companion backend branch so examples never promise behavior the API does not yet provide.

**Tech Stack:** Mintlify, MDX, `docs.json`, Mintlify CLI validation

---

**Design spec:** `docs/superpowers/specs/2026-08-21-widget-eft-disclosures-design.md`
**Companion backend plan:** `platform-accounts-service/docs/superpowers/plans/2026-08-21-widget-eft-disclosures.md` on `feat/widget-eft-disclosures`

## File map

- Modify `widget/disclosures.mdx` — canonical user journey, EFT applicability, versioning, session reporting, and compatibility behavior.
- Modify `widget.mdx` — short overview that routes readers to the canonical disclosure page.
- Modify `widget/create-user.mdx` — EFT-only `outstanding_disclosures` semantics and example.
- Modify `widget/create-session.mdx` — remove the incorrect Terms/Privacy prerequisite and explain read-only EFT status.
- Modify `widget/get-disclosure-status.mdx` — EFT-only status response.
- Modify `widget/submit-disclosure-acceptance.mdx` — type-`6` request contract and ignored-ID compatibility rule.
- Verify `docs.json` — no navigation change is expected because all pages already exist.

### Task 1: Rewrite the canonical disclosure owner page

**Files:**
- Modify: `widget/disclosures.mdx`

- [ ] **Step 1: Capture the old broad contract before editing**

Run:

```bash
rg -n 'Terms of Service|Privacy Policy|all current disclosure types|type_id.*2' \
  widget/disclosures.mdx
```

Expected: matches show that the page currently tells publishers to handle ZBD
Terms/Privacy and shows a type-`2` session example.

- [ ] **Step 2: Replace `widget/disclosures.mdx` with the EFT-only owner content**

Use this complete page:

````mdx
---
title: "Disclosure Agreements"
description: "Understand how widget EFT disclosure acceptance works before ACH cashout."
---

## Overview

The widget disclosure APIs expose the Electronic Funds Transfer disclosure
(EFT, type `6`). This disclosure authorizes ACH bank payouts when it applies to
your integration.

Exact disclosure types required depend on your contract and the services you
use. ACH cashout requires the user to accept the latest EFT version. ZBD Terms
of Service (type `2`) and Privacy Policy (type `3`) are handled by ZBD-owned
product flows and are not accepted through the widget disclosure endpoints.

Your application presents the applicable EFT document outside the widget and
collects the user's explicit acceptance. The widget does not render the
document or record acceptance automatically during user or session creation.

## End-to-end Flow

```text
1. Your server creates or resolves the widget user.
2. Your server reads `outstanding_disclosures` or calls Get Disclosure Status.
3. If EFT applies, your application presents the EFT document outside the widget.
4. Your server records acceptance by submitting disclosure type 6.
5. Your server creates a widget session.
6. Your frontend opens the returned `widget_url`.
7. ACH cashout can proceed after the current EFT version is accepted.
```

<Info>
  Disclosure APIs require your server-side API key. Never call them from a browser, mobile client, game client, or WebView.
</Info>

## Outstanding Disclosures on User Creation

The [Create User](/widget/create-user) response
(`POST /api/v1/widget/users`) includes an `outstanding_disclosures` array. The
array contains the latest EFT disclosure when it is not current for that user.
It is empty when there is no outstanding widget-supported disclosure.

An empty array does not mean the user has accepted every disclosure used by
every ZBD product. It only describes the disclosure supported by the widget
API.

Use the dedicated endpoints when you need the complete widget EFT state:

- [Get Disclosure Status](/widget/get-disclosure-status) — returns the current
  EFT version with `tos_current` and `accepted_at`.
- [Submit Disclosure Acceptance](/widget/submit-disclosure-acceptance) — records
  acceptance of the latest EFT version from your server.

<Note>
  `GET /api/v2/session/me` exposes the same EFT-only `outstanding_disclosures` shape during a session. It is read-only status; the widget does not collect acceptance.
</Note>

## Widget Disclosure Type

| Disclosure type | Type ID | Used for |
|---|---:|---|
| Electronic Funds Transfer | `6` | ACH bank payout authorization |

<Note>
  ACH cashout submission requires the current EFT disclosure. If the latest version is outstanding, the cashout request is rejected until acceptance is recorded.
</Note>

## Versioning

ZBD tracks acceptance by disclosure type and version. A user who accepted an
older EFT version must accept a newly published version before ACH cashout can
continue. User and session creation report the latest outstanding version but
never accept it automatically.

## Session Status

During a widget session, `GET /api/v2/session/me` can return outstanding EFT as
read-only status:

```json
{
  "success": true,
  "data": {
    "id": "4ac4fd8a-cc2c-4d03-af09-a76f4e89d652",
    "email": "player@example.com",
    "is_id_verified": true,
    "kyc_tier": 2,
    "kyc_status": "approved",
    "capabilities": [],
    "outstanding_disclosures": [
      {
        "id": 60,
        "type_id": 6,
        "name": "Electronic Funds Transfer",
        "description": "ZBD Electronic Funds Transfer Document.",
        "version": "1.0.0",
        "content_uri": "https://...",
        "created_at": "2026-06-24T20:11:45Z",
        "due_date": "2025-08-11T00:00:00"
      }
    ]
  },
  "message": "Session account status retrieved successfully.",
  "error": null
}
```

If `outstanding_disclosures` is empty, there is no outstanding
widget-supported disclosure. If EFT appears and applies to your integration,
return the user to your publisher-side acceptance flow.

## Recording acceptance

Use [Get Disclosure Status](/widget/get-disclosure-status) to read the current
EFT state and [Submit Disclosure Acceptance](/widget/submit-disclosure-acceptance)
to record type `6` after the user accepts the displayed document.

<Warning>
  The partner backend records the user's explicit acceptance. Neither Create User nor Create Session accepts a disclosure automatically.
</Warning>

## Backward compatibility

The submit endpoint considers only widget-supported type `6`. Other submitted
type IDs are ignored and are not recorded. For example, an older payload of
`[2, 3, 6]` records only type `6`, and the response contains `[6]`. A non-empty
payload containing only unsupported IDs is a successful no-op and returns an
empty accepted-ID list.

New and updated integrations should submit only `[6]`.

## Existing Users

For an existing user, call the disclosure endpoint whenever EFT is outstanding.
Do not rely on an idempotent Create User request to record acceptance.

## Sandbox

Sandbox uses the same EFT status and acceptance model as production. Use your
sandbox API key and sandbox API base URL:

```text
https://sandbox-api.zbdpay.com
```

Some sandbox bypass settings can skip cashout checks. Disable the applicable
bypass when testing the ACH EFT gate end to end.
````

- [ ] **Step 3: Confirm the canonical page no longer assigns ZBD disclosures to publishers**

Run:

```bash
rg -n 'Terms of Service|Privacy Policy|type `2`|type `3`' widget/disclosures.mdx
```

Expected: the only matches explain that types `2` and `3` are ZBD-owned and are
not accepted through widget endpoints.

- [ ] **Step 4: Commit the owner-page rewrite**

```bash
git add widget/disclosures.mdx
git commit -m "docs(widget): scope disclosure guide to EFT"
```

### Task 2: Align widget overview and lifecycle pages

**Files:**
- Modify: `widget.mdx`
- Modify: `widget/create-user.mdx`
- Modify: `widget/create-session.mdx`

- [ ] **Step 1: Update the widget overview**

In `widget.mdx`, replace the final sentence of `## Overview` with:

```mdx
Your backend creates widget users, funds their point balances, creates sessions,
and records any applicable widget disclosure acceptance before a service that
requires it is used.
```

Replace `## Terms and disclosures` with:

```mdx
## Disclosures

Your application presents and records applicable widget disclosures outside the
iframe. Exact disclosure types required depend on your contract and the
services you use. For ACH cashout, the widget disclosure APIs report and record
Electronic Funds Transfer disclosure type `6`.

ZBD Terms of Service and Privacy Policy are handled by ZBD-owned product flows,
not by the publisher through widget endpoints. See
[Disclosure Agreements](/widget/disclosures) for the complete flow.
```

- [ ] **Step 2: Update Create User wording and example**

Replace the opening note in `widget/create-user.mdx` with:

```mdx
<Note>
  The response reports the latest outstanding widget-supported EFT disclosure. Whether EFT applies depends on your contract and services; ACH cashout requires it. See [Disclosure Agreements](/widget/disclosures).
</Note>
```

Replace the response introduction, field text, and follow-up note with:

```mdx
The response `data` includes the new (or existing) user plus an
`outstanding_disclosures` array. The array contains the latest Electronic Funds
Transfer disclosure (type `6`) when it is outstanding and is otherwise empty.
No disclosure is accepted automatically during user creation.

<ResponseField name="outstanding_disclosures" type="array">
  The latest outstanding widget-supported EFT disclosure. Empty when no EFT version is outstanding. Each entry includes `id`, `type_id`, `name`, `description`, `version`, `content_uri`, `created_at`, and `due_date`.
</ResponseField>

<Note>
  To read the current EFT version together with `tos_current` and `accepted_at`, call [Get Disclosure Status](/widget/get-disclosure-status). See [Disclosure Agreements](/widget/disclosures) for applicability and enforcement.
</Note>
```

Change the single disclosure object in the response example to:

```json
{
  "id": 60,
  "type_id": 6,
  "name": "Electronic Funds Transfer",
  "description": "ZBD Electronic Funds Transfer Document.",
  "version": "1.0.0",
  "content_uri": "https://...",
  "created_at": "2026-06-24T20:11:45Z",
  "due_date": "2025-08-11T00:00:00"
}
```

- [ ] **Step 3: Remove the Terms/Privacy prerequisite from Create Session**

Replace the disclosure paragraphs in `widget/create-session.mdx` with:

```mdx
Exact disclosure types required depend on your contract and the services you
use. For ACH cashout, your application presents and records the current
Electronic Funds Transfer disclosure (type `6`) outside the widget.

The session can report outstanding EFT through `outstanding_disclosures`, but
it does not render the document, collect acceptance, or accept anything
automatically. ACH cashout enforces the current EFT version when the cashout is
submitted. See [Disclosure Agreements](/widget/disclosures).
```

- [ ] **Step 4: Search the lifecycle pages for obsolete instructions**

Run:

```bash
rg -n 'must.*Terms|must.*Privacy|before.*session|type_id.*2|Terms of Service Document' \
  widget.mdx widget/create-user.mdx widget/create-session.mdx
```

Expected: no publisher instruction to accept ZBD Terms/Privacy and no type-`2`
widget example. A sentence saying Create User/Create Session does not
auto-accept a disclosure is expected.

- [ ] **Step 5: Commit the lifecycle-page updates**

```bash
git add widget.mdx widget/create-user.mdx widget/create-session.mdx
git commit -m "docs(widget): align lifecycle disclosure guidance"
```

### Task 3: Update the disclosure endpoint references

**Files:**
- Modify: `widget/get-disclosure-status.mdx`
- Modify: `widget/submit-disclosure-acceptance.mdx`

- [ ] **Step 1: Make Get Disclosure Status EFT-only**

Replace the opening description in `widget/get-disclosure-status.mdx` with:

```mdx
Returns the user's acceptance status for the current Electronic Funds Transfer
disclosure (EFT, type `6`). If no EFT disclosure version is currently
published, `data` is empty.

Use this from your server to determine whether the latest EFT version is
current. Exact disclosure types required depend on your contract and the
services you use; ACH cashout requires current EFT acceptance. Present the
document outside the widget and record acceptance with
[Submit Disclosure Acceptance](/widget/submit-disclosure-acceptance).

ZBD Terms of Service and Privacy Policy are not returned by this widget
endpoint. The API key determines the publisher/project context, and `userId` is
the ZBD user ID returned when the widget user is created or resolved.
```

Replace the response `data` array with:

```json
"data": [
  {
    "type_id": 6,
    "name": "Electronic Funds Transfer",
    "version": "1.0.0",
    "tos_current": false,
    "accepted_at": null
  }
]
```

Replace the field explanation after the example with:

```mdx
`tos_current` retains its existing field name and means the user has accepted
the current EFT version. `false` means there is no EFT acceptance on record or
the latest acceptance belongs to an older EFT version.
```

- [ ] **Step 2: Make Submit Disclosure Acceptance EFT-only and document filtering**

Replace the opening description in
`widget/submit-disclosure-acceptance.mdx` with:

```mdx
Records the user's acceptance of the latest Electronic Funds Transfer
disclosure (EFT, type `6`). Use this from your server after your application has
presented the EFT document and collected the user's explicit acceptance. Do not
call this endpoint from a browser, mobile client, game client, or WebView.
```

Replace the body parameter text with:

```mdx
<ParamField required body="acceptedDisclosureTypeIds" type="array">
  Widget disclosure type IDs accepted by the user. Submit `[6]` to record the latest EFT version.
</ParamField>
```

Replace `## Disclosure Type IDs` with:

```mdx
## Widget Disclosure Type ID

| Disclosure type | Type ID |
|---|---:|
| Electronic Funds Transfer | `6` |

Exact disclosure types required depend on your contract and the services you
use. ACH cashout requires the current EFT version.

## Backward compatibility

The endpoint considers only type `6`. Other type IDs are ignored and are not
recorded. An older request containing `[2, 3, 6]` records EFT only and returns
`[6]`. A non-empty request containing only unsupported IDs returns `201` with an
empty `acceptedDisclosureTypeIds` array.

New and updated integrations should submit only `[6]`.
```

Replace the `400` error row with:

```mdx
| `400` | `acceptedDisclosureTypeIds` is empty or missing |
```

- [ ] **Step 3: Confirm the endpoint examples and errors match the backend plan**

Run:

```bash
rg -n 'type_id|acceptedDisclosureTypeIds|Terms of Service|Privacy Policy|unknown disclosure' \
  widget/get-disclosure-status.mdx widget/submit-disclosure-acceptance.mdx
```

Expected: response/request examples use type `6`; Terms/Privacy appear only in
the explanation that they are outside the widget route; the error table no
longer says unsupported non-empty IDs return `400`.

- [ ] **Step 4: Commit the endpoint-reference updates**

```bash
git add widget/get-disclosure-status.mdx widget/submit-disclosure-acceptance.mdx
git commit -m "docs(widget): document EFT-only disclosure endpoints"
```

### Task 4: Validate the complete public documentation contract

**Files:**
- Verify: `widget.mdx`
- Verify: `widget/disclosures.mdx`
- Verify: `widget/create-user.mdx`
- Verify: `widget/create-session.mdx`
- Verify: `widget/get-disclosure-status.mdx`
- Verify: `widget/submit-disclosure-acceptance.mdx`
- Verify: `docs.json`

- [ ] **Step 1: Run a scoped semantic audit**

```bash
rg -n 'type_id": 2|type_id": 3|acceptedDisclosureTypeIds.*2|acceptedDisclosureTypeIds.*3' \
  widget.mdx widget
rg -n 'Terms of Service|Privacy Policy' \
  widget.mdx widget/disclosures.mdx widget/create-user.mdx \
  widget/create-session.mdx widget/get-disclosure-status.mdx \
  widget/submit-disclosure-acceptance.mdx
rg -n 'Exact disclosure types required depend on your contract and the services you use' \
  widget.mdx widget
```

Expected:

- the first command prints no widget request/response examples using types `2`
  or `3`;
- Terms/Privacy matches only explain that ZBD-owned flows handle them; and
- the applicability sentence appears on the canonical page and the necessary
  entry/reference pages without being pasted into unrelated pages.

- [ ] **Step 2: Confirm navigation still includes every edited child page**

Run:

```bash
node -e 'const d=require("./docs.json"); const s=JSON.stringify(d); for (const p of ["widget/disclosures","widget/create-user","widget/create-session","widget/get-disclosure-status","widget/submit-disclosure-acceptance"]) { if (!s.includes(`"${p}"`)) throw new Error(`missing ${p}`); } console.log("widget disclosure pages are indexed")'
```

Expected: `widget disclosure pages are indexed`.

- [ ] **Step 3: Run Mintlify link and build validation**

```bash
npx --yes mintlify@latest broken-links
npx --yes mintlify@latest validate
```

Expected: both commands exit `0` with no broken links, MDX parse errors, or
strict validation warnings. If Mintlify reports a pre-existing unrelated issue,
capture the exact output and prove the edited pages introduce no new issue.

- [ ] **Step 4: Inspect the complete branch diff**

```bash
git diff origin/main --check
git diff origin/main --stat
git diff origin/main -- widget.mdx widget
git status --short
```

Expected: the diff contains the committed design/plan plus the six scoped widget
pages; there is no `docs.json` change, no whitespace error, and the worktree is
clean after commits.

- [ ] **Step 5: Coordinate release with the backend branch**

Confirm the companion `platform-accounts-service` branch has passing tests and
the filtering behavior before publishing the public docs. The docs may be
reviewed in parallel, but their production promise should not lead the backend
rollout. Existing partner payloads remain compatible because the backend ignores
types `2` and `3`; the forward contract documented here is `[6]` only.
