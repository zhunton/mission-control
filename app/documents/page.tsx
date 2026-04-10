"use client";

import { useState } from "react";
import { Download } from "lucide-react";

const documents = [
  {
    id: "vantascout-overview",
    title: "VantaScout — Product Overview",
    type: "Strategy",
    agent: "Wally",
    date: "Apr 9, 2026",
    content: `# VantaScout
## A Map of Every HVAC Asset You Can Sell Service On

A web-based tool that uses satellite/aerial imagery and AI computer vision to detect commercial HVAC equipment (cooling towers, RTUs, chillers) on building rooftops. Cross-references with property data to generate qualified leads for HVAC service companies — identifying buildings with aging or detectable equipment before competitors do.

---

## The Problem

Commercial HVAC contractors are flying blind when it comes to prospecting. Generic lead tools tell you a building is 100,000 square feet. That's useless.

Contractors don't think in square feet. They think in units.

**"How many RTUs are on that roof? How many cooling towers? What's the full service footprint?"**

That's the question that determines whether a building is worth pursuing — and no tool in the market answers it. Until now.

---

## What VantaScout Does

VantaScout uses satellite and aerial imagery combined with AI computer vision to detect and count commercial HVAC equipment on building rooftops — RTUs, cooling towers, chillers, condensing units — across an entire city.

The output is simple and immediately actionable:

> **"Building at 1420 Main St, Houston TX — 8 RTUs, 2 cooling towers, 1 chiller. Estimated annual service value: $45,000."**

Every commercial building. Mapped. Scored. Ready to prospect.

---

## Three Revenue Use Cases

### 1. Service Agreement Prospecting *(Most Important)*

Service agreements are the lifeblood of commercial HVAC. Recurring revenue, predictable margins, long-term customer relationships. The challenge is finding them.

A building with 8 RTUs and 2 cooling towers is not just a lead — it is a $30,000-$60,000/year service contract waiting to be proposed. VantaScout identifies these buildings before your competitors do.

**What contractors get:**
- Full equipment inventory by building
- Unit counts by type (RTU, cooling tower, chiller, etc.)
- Total serviceable footprint — the number that determines contract value
- Contact information for building owners and facility managers

**Why this wins:** Service agreements are priced and planned per unit. Contractors need unit counts to build proposals. VantaScout gives them that data in seconds instead of requiring a site visit.

---

### 2. Replacement and Capital Projects

Large commercial systems do not last forever. Older buildings with aging equipment represent high-margin replacement opportunities — new chillers, cooling tower rebuilds, RTU changeouts.

VantaScout identifies:
- Buildings with visually detectable aging equipment
- Older structures with older installed systems
- Large tonnage equipment where replacement jobs are six-figure projects

---

### 3. Competitive Intelligence and Market Awareness

Know your territory better than anyone:
- Which buildings have equipment you are not currently servicing
- Where competitors are active
- New construction with fresh equipment that needs first-year service contracts
- Buildings recently upgraded — identify before competitors lock in long-term agreements

---

## The Lead Scoring Model

Every detected building gets scored automatically:

- **Equipment count** — Revenue potential. More units = bigger contract.
- **Equipment type** — Complexity and value tier. Chiller > cooling tower > RTU.
- **Building size** — Budget likelihood and organizational complexity.
- **Location** — Service route efficiency for your team.
- **Pull Through Revenue** — For every $1 of service agreement revenue, HVAC contractors typically generate $1-$4 in additional pull through (repair, emergency service, parts) revenue on the backend. A $45K/year service agreement may represent $45K-$180K in total annual opportunity.

**Output:** "This building is a $25,000/year service agreement opportunity — with $25,000-$100,000 in estimated pull through revenue. Total annual opportunity: up to $125,000."

Not just a list of buildings. A ranked, prioritized pipeline your sales team can work immediately.

---

## The Internal Advantage

Before VantaScout is a product, it is a competitive weapon for the companies that pilot it first.

Running VantaScout against an existing customer database immediately surfaces:
- **Missed buildings** — commercial properties in your territory you have never called on
- **Under-served accounts** — existing customers with equipment you are not currently maintaining
- **Priority targets** — ranked by estimated contract value

For a company with a large territory, this is the difference between a sales team prospecting blind and a sales team working from a complete map of the opportunity.

---

## Why This Does Not Exist Yet

Solar companies use satellite imagery to identify viable rooftops and sell those leads to solar installers. Roofing companies use aerial imagery to detect damage for storm-response marketing.

Nobody has applied this model to commercial HVAC — despite the fact that the need is larger, the contracts are more valuable, and the technology is proven.

Academic research has demonstrated 87-91% accuracy in detecting commercial rooftop HVAC equipment from aerial imagery. The gap is real and unoccupied.

---

## Technical Foundation

- **Imagery:** High-resolution aerial imagery (Nearmap, EagleView)
- **AI Model:** Computer vision fine-tuned for commercial HVAC equipment detection
- **Property Data:** Cross-referenced with building ownership databases
- **Platform:** Web-based SaaS dashboard with territory selection, equipment map, lead export, and CRM integration

---

## Positioning

**Not:** "AI that detects old equipment"

**Yes:** "A map of every HVAC asset you can sell service on"

VantaScout is a prospecting platform. The core value is knowing where the equipment is and how much of it there is. That answer alone changes how a commercial HVAC company prospects, plans, and grows.

---

*Prepared by Wally — April 9, 2026*
*VantaScout is currently in research and validation phase.*`,
  },
  {
    id: "chuckl-ui-spec",
    title: "Chuckl — UI/UX Spec for React Native Build",
    type: "Product",
    agent: "Wally",
    date: "Apr 10, 2026",
    content: `# Chuckl — UI/UX Specification
## React Native Build Reference Document
*Prepared by Wally | April 10, 2026*

---

## Overview

Chuckl is a utility app for browsing and stashing reaction GIFs and images. The core loop is simple: browse → stash → copy → paste into any chat. Everything in the design should serve that loop. Fast, clean, zero friction.

**Platform:** iOS first (React Native + Expo)
**Backend:** Supabase
**Design language:** Dark, bold, minimal. Space Mono + Bebas Neue fonts. Accent: #FF3B30 (red-coral).

---

## Navigation

**3 tabs, bottom navigation bar:**

| Tab | Icon | Description |
|-----|------|-------------|
| Feed | Home/stream icon | Newest approved reactions, newest first |
| Library | Grid icon | Full browsable library |
| Profile | Person icon | User profile + Stash |

No top navigation bar. Clean, app-style.

---

## Screen 1: Feed

**Purpose:** Discovery. New content lands here first. Feels alive and fresh.

**Header:**
- Left: CHUCKL logo (icon + wordmark)
- Right: + button (accent red, 32x32, rounded square) — opens submission modal

**Content:**
- Single column feed
- Each card: reaction content (full width, 4:3 aspect ratio) + persistent bottom strip
- Bottom strip always visible: reaction label | stash count | STASH button | COPY button
- Timestamp badge top-right corner: "New" (within 24hrs) or "Xd ago"
- GIF badge top-left if animated
- Featured badge (gold star or crown) for Vault Keeper-elevated content

**Behavior:**
- STASH button: adds to user stash, increments stash count, button turns filled/confirmed
- COPY button: copies media URL to clipboard, shows toast "Copied! Ready to paste"
- Freemium: if user hits 30 stash limit, show upgrade modal instead of stashing

**Submission Modal (+ button):**
- Title: "Submit a Reaction"
- File picker: select GIF or image from camera roll or URL
- Category dropdown: all categories
- Label text input: what is this reaction called?
- Submit button → toast "Submitted! We will add it if it is fire 🔥"
- Content goes live immediately (open uploads model)

---

## Screen 2: Library

**Purpose:** Browse and discover. The full catalog, organized and searchable.

**Header:**
- Search bar (full width): "search reactions..."

**Sort controls (below search):**
- 3 toggle options: Most Stashed | Trending | New
- Default: Most Stashed

**Category chips (horizontal scroll below sort):**
All | Reactions | Hype | Awkward | Savage | Confused | Relatable | Wholesome | No Thanks | Agreement | Shock

**Content:**
- Single column feed (same card style as Feed)
- Default sort: stash count descending within selected category
- New items (within 24hrs): shown in discovery window regardless of stash count, with "New" badge
- Featured items: shown with gold badge, weighted higher in ranking

**Behavior:**
- Category chip filters library in real-time
- Sort toggle re-sorts immediately
- Same STASH/COPY behavior as Feed

---

## Screen 3: Profile

**Header area:**
- Banner image (gradient or pattern, accent color)
- Avatar (user initials circle, 60x60) positioned bottom-left of banner, overlapping
- Gear icon (top-right of banner) → opens Settings sheet
- Username below avatar
- Stash stats: X / 30 stashed | X GIFs | X Pics

**Settings Sheet (gear icon):**
- Notifications toggle
- Dark Mode (disabled, already dark)
- Upgrade to Premium ($2.99/month) — prominent CTA button

**MY STASH section:**
- Search bar: "search your stash..."
- Category chips (same as Library) — filters stash
- 3-column grid (Instagram style, 2px gaps, square cells)
- No labels visible in grid view — just the content

**Stash Viewer (tap any item):**
- Full screen overlay (dark background)
- Reaction content centered, large
- Bottom strip: label | stash count | REMOVE button | COPY button
- Top: X close button (left) | position counter "3 / 12" (center) | share icon (right)
- Left/right arrows to navigate between stashed items (wraps around)
- REMOVE: removes from stash, advances to next, closes if last item

**Freemium counter:**
- Progress bar under stash stats: fills as limit approaches
- At 30/30: bar turns red, upgrade prompt shown

---

## Auth Screens

**Sign Up:**
- App icon + wordmark centered
- Email + password fields
- Continue button (accent red, full width)
- "Or continue with Apple" button (Apple Sign-In)
- "Already have an account? Log in" link

**Log In:**
- Same layout
- Email + password
- Apple Sign-In
- "Forgot password?" link
- "New here? Sign up" link

---

## Freemium Upgrade Modal

Triggered when user tries to stash item #31.

- Icon: lock or stash icon
- Headline: "Stash Full!"
- Body: "Upgrade to Premium for unlimited stash — plus priority in featured content."
- Price: $2.99 / month
- Primary CTA: "Upgrade Now" (accent red, full width)
- Secondary: "Not now" (dismiss)

---

## Content System

**Two content tiers:**

| Tier | How it gets there | Ranking |
|------|-------------------|---------|
| Featured | Vault Keeper marks as featured | Top of feed/library, gold badge |
| Standard | Any user upload | Normal ranking by stash count/recency |

**Vault Keeper role:**
- Small group of trusted users (Zach + designated friends)
- Can mark any reaction as "Featured"
- Can remove content (flag for removal)
- Vault Keeper status set in Supabase user table

**How featuring works (the simple version):**
- All uploads go live instantly — no approval queue, no delay
- Vault Keepers see a ⭐ star button on every reaction that regular users cannot see
- Tapping ⭐ flips is_featured = true in the database — instant effect
- The reaction gets a gold badge and a 2x ranking boost
- Regular users never see the star button
- Vault Keepers can also un-feature by tapping ⭐ again
- This is post-publish curation, not pre-publish gating — the feed stays fresh regardless of Vault Keeper activity

---

## Profile Tags (Achievement System)

Users can earn profile tags based on achievements and display one tag on their profile. Tags create identity, drive engagement, and reward specific behaviors.

### The Four Launch Tags

| Tag | How to Earn | What it drives |
|-----|-------------|---------------|
| **Vault Keeper** | Manually assigned by Zach — trusted curators only | Quality control, featured content elevation |
| **OG** | Joined within the first 30 days of launch — never earnable again | Early adoption, word of mouth |
| **Hoarder** | Stashed 500+ reactions | Heavy stash usage, retention |
| **Plug** | Uploaded 20+ reactions still live after 30 days | Quality content contributions |

### Tag Rules
- Each user can display only ONE tag on their profile at a time (their choice)
- Tags are permanent once earned — except Vault Keeper (can be removed by admin)
- OG tag is the most exclusive — once the 30-day window closes, it is gone forever
- Plug requires posts to still be live after 30 days — removed/flagged posts do not count toward the threshold

### Plug Anti-Spam Logic
The 30-day live requirement is the key spam deterrent:
- Spammed posts get flagged and removed → do not count
- Only quality content that survives moderation counts toward Plug
- Counter resets if posts are removed — keeps the bar meaningful

### Database Column
Add a \`profile_tag\` column to the users table (text, nullable) — stores the currently displayed tag.

---

**Content ranking formula:**
- Stash score = stash count (all time)
- Trending score = stash count in last 48hrs × recency weight
- New window = items uploaded in last 24hrs always shown regardless of score
- Featured items get a 2x ranking multiplier

---

## Design Tokens

| Token | Value |
|-------|-------|
| Background | #0a0a0a |
| Surface | #1a1a1a |
| Border | #2a2a2a |
| Accent | #FF3B30 |
| Gold (Featured) | #FFD700 |
| Text | #F0F0F0 |
| Muted | #666666 |
| Font (headings) | Bebas Neue |
| Font (body/ui) | Space Mono |
| Border radius (cards) | 8px |
| Border radius (buttons) | 4px |

---

## Supabase Database Schema

### reactions table
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | primary key |
| url | text | image/GIF URL in Supabase Storage |
| label | text | reaction name |
| category | text | category slug |
| type | text | "gif" or "image" |
| stash_count | int | incremented on each stash |
| trending_score | float | updated periodically |
| is_featured | bool | set by Vault Keepers |
| is_new | bool | true for first 24hrs |
| submitted_by | uuid | user id |
| created_at | timestamp | |

### users table
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | matches Supabase Auth uid |
| username | text | |
| is_curator | bool | Vault Keeper status |
| is_premium | bool | paid subscriber |
| stash_count | int | current stash size |
| created_at | timestamp | |

### stashes table
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | primary key |
| user_id | uuid | foreign key → users |
| reaction_id | uuid | foreign key → reactions |
| created_at | timestamp | |

### flags table
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | primary key |
| reaction_id | uuid | |
| flagged_by | uuid | |
| reason | text | |
| created_at | timestamp | |

---

*This document is the source of truth for the Chuckl React Native build. Update it when product decisions change.*
*Last updated: April 10, 2026 by Wally*`,
  },
  {
    id: "hunton-genealogy",
    title: "Hunton Family — Compendium of American Genealogy",
    type: "Research",
    agent: "Wally",
    date: "Apr 3, 2026",
    content: `# Hunton Family in the Compendium of American Genealogy
Prepared by Wally | April 3, 2026 | Based on actual source text

## Source
Abridged Compendium of American Genealogy, Volume 1
Editor: Frederick Adams Virkus, F.I.A.G.
Pages: 403–404
Digital copy: archive.org/details/abridgedcompendi01virk

## Index Entries in Volume 1
- Eppa Hunton — p. 403
- Eppa Hunton Jr. — pp. 403–404
- James Hunton — p. 403
- Thomas Hunton — p. 403
- William Hunton — p. 403
- Virginia Semmes Payne Hunton — p. 404

## Primary Entry: HUNTON, Eppa Jr. (pp. 403–404)

**Subject:** Eppa Hunton Jr., born Prince William County, Virginia, April 14, 1855.

**6th generation:** Thomas Hunton — from England, settled Lancaster County, Virginia, ca. 1700. Married 1722, Mary Carrell.

**5th generation:** (Son of Thomas) — moved to Fauquier County, Virginia. Married Judith.

**4th generation:** James Hunton (b. 1763) — married 1st, 1786, Hannah L. Brown of King George County, Virginia.

**3rd generation:** Eppa Hunton (b. 1789) — married Elizabeth Marye Brent.

**2nd generation (father):** Eppa Hunton (1822–1908) — lawyer; Virginia Secession Convention; Colonel, 8th Virginia Infantry; Brigadier General C.S.A. 1861–65 (wounded at Gettysburg); Congressman 1873–81; U.S. Senator 1892–95. Married 1848, Lucy Caroline Weir. Children: Elizabeth Marye (d. infancy); Eppa Jr.

**Subject — Eppa Hunton Jr.:** University of Virginia, LL.B. 1877. Co-founded Mumford, Hunton, Williams & Anderson (became Hunton & Williams, now Hunton Andrews Kurth). Counsel for Southern Railway, Federal Reserve Bank of Richmond. President, Richmond, Fredericksburg & Potomac Railroad (1920). Virginia Legislature 1898; Virginia Constitutional Convention 1901. Residence: 810 W. Franklin St., Richmond, VA.

**Married 1st:** Erva Winston Payne (1861–1897).
**Married 2nd:** Virginia Semmes Payne (b. 1867), sister of first wife.
**Children:** Mary Winter (b. and d. 1902); Eppa Hunton IV (b. July 31, 1904).

## Key Facts

Thomas Hunton came from England and settled in Lancaster County, Virginia ca. 1700 — 6 generations back from Eppa Jr. (b. 1855).

The law firm Eppa Jr. co-founded became Hunton Andrews Kurth, one of Virginia's most prominent firms, still operating today.

No "Mary Ball/Washington connection" confirmed in this source — earliest wife listed is Mary Carrell (married 1722).

Source: Text extracted directly from OCR of archive.org digitized volume.`,
  },
];

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const result: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      result.push(
        <ul key={key++} style={{ margin: "6px 0 10px 0", paddingLeft: 20, listStyleType: "disc" }}>
          {listItems}
        </ul>
      );
      listItems = [];
    }
  };

  const renderInline = (s: string): React.ReactNode => {
    const parts = s.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith("**") && p.endsWith("**") ? (
        <strong key={i}>{p.slice(2, -2)}</strong>
      ) : (
        p
      )
    );
  };

  for (const raw of lines) {
    const line = raw;

    if (/^### /.test(line)) {
      flushList();
      result.push(
        <div key={key++} style={{ fontSize: 13, fontWeight: 700, color: "#e5e7eb", marginTop: 16, marginBottom: 4 }}>
          {renderInline(line.slice(4))}
        </div>
      );
    } else if (/^## /.test(line)) {
      flushList();
      result.push(
        <div key={key++} style={{ fontSize: 15, fontWeight: 700, color: "#f3f4f6", marginTop: 20, marginBottom: 6, borderBottom: "1px solid #2a2a2a", paddingBottom: 4 }}>
          {renderInline(line.slice(3))}
        </div>
      );
    } else if (/^# /.test(line)) {
      flushList();
      result.push(
        <div key={key++} style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
          {renderInline(line.slice(2))}
        </div>
      );
    } else if (/^- /.test(line)) {
      listItems.push(
        <li key={key++} style={{ marginBottom: 3 }}>
          {renderInline(line.slice(2))}
        </li>
      );
    } else if (/^\d+\. /.test(line)) {
      flushList();
      result.push(
        <div key={key++} style={{ marginBottom: 4, paddingLeft: 4 }}>
          {renderInline(line)}
        </div>
      );
    } else if (line.trim() === "") {
      flushList();
      result.push(<div key={key++} style={{ height: 8 }} />);
    } else {
      flushList();
      result.push(
        <div key={key++} style={{ marginBottom: 2 }}>
          {renderInline(line)}
        </div>
      );
    }
  }

  flushList();
  return result;
}

function downloadDocument(title: string, content: string) {
  // Convert markdown to HTML
  const html = content
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[h|u|l|p])/gm, "")

  const printWindow = window.open("", "_blank")
  if (!printWindow) return

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Georgia, serif; font-size: 12pt; line-height: 1.6; margin: 1in; color: #000; }
        h1 { font-size: 18pt; margin-bottom: 8pt; border-bottom: 1px solid #333; padding-bottom: 4pt; }
        h2 { font-size: 14pt; margin-top: 16pt; margin-bottom: 6pt; }
        h3 { font-size: 12pt; margin-top: 12pt; }
        table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
        th, td { border: 1px solid #999; padding: 6pt 8pt; text-align: left; }
        th { background: #f0f0f0; font-weight: bold; }
        ul { margin: 8pt 0; padding-left: 20pt; }
        li { margin: 3pt 0; }
        p { margin: 8pt 0; }
        @media print { body { margin: 0.75in; } }
      </style>
    </head>
    <body>
      <p>${html}</p>
    </body>
    </html>
  `)
  printWindow.document.close()
  setTimeout(() => printWindow.print(), 500)
}

export default function DocumentsPage() {
  const [selected, setSelected] = useState<string | null>(null);

  const doc = documents.find((d) => d.id === selected);

  if (doc) {
    return (
      <div style={{ padding: "32px", minHeight: "100vh" }}>
        <button
          onClick={() => setSelected(null)}
          style={{
            background: "none",
            border: "none",
            color: "#6b7280",
            fontSize: 13,
            cursor: "pointer",
            marginBottom: 20,
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ← Back to Documents
        </button>
        <div style={{ marginBottom: 20, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0, marginBottom: 6 }}>{doc.title}</h1>
            <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#6b7280" }}>
              <span>{doc.type}</span>
              <span>·</span>
              <span>{doc.agent}</span>
              <span>·</span>
              <span>{doc.date}</span>
            </div>
          </div>
          <button
            onClick={() => downloadDocument(doc.title, doc.content)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#1e1e1e",
              border: "1px solid #333",
              borderRadius: 7,
              color: "#9ca3af",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              padding: "6px 12px",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#555";
              (e.currentTarget as HTMLButtonElement).style.color = "#e5e7eb";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#333";
              (e.currentTarget as HTMLButtonElement).style.color = "#9ca3af";
            }}
          >
            <Download size={13} />
            Download PDF
          </button>
        </div>
        <div
          style={{
            background: "#161616",
            border: "1px solid #222",
            borderRadius: 12,
            padding: "28px 32px",
            color: "#d1d5db",
            fontSize: 14,
            lineHeight: 1.75,
            fontFamily: "inherit",
          }}
        >
          {renderMarkdown(doc.content)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px", minHeight: "100vh" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0, marginBottom: 4 }}>Documents</h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Files generated by Wally or other agents</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {documents.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelected(d.id)}
            style={{
              background: "#161616",
              border: "1px solid #222",
              borderRadius: 10,
              padding: "16px 20px",
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = "#444")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.borderColor = "#222")}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{d.title}</div>
              <div style={{ fontSize: 12, color: "#6b7280", display: "flex", gap: 10 }}>
                <span>{d.type}</span>
                <span>·</span>
                <span>{d.agent}</span>
                <span>·</span>
                <span>{d.date}</span>
              </div>
            </div>
            <div style={{ color: "#374151", fontSize: 16 }}>→</div>
          </button>
        ))}
      </div>
    </div>
  );
}
