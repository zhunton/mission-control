"use client";

import { useState } from "react";
import { Download } from "lucide-react";

const documents = [
  {
    id: "hunton-genealogy",
    title: "Hunton Family — Compendium of American Genealogy",
    type: "Research",
    agent: "Wally",
    date: "Apr 3, 2026",
    content: `# Hunton Family in the Compendium of American Genealogy
Prepared by Wally | April 3, 2026

## Overview
The Hunton family surname appears in the Compendium of American Genealogy (Virkus, 1925–1942), a 7-volume genealogical encyclopedia of prominent early American families. The Hunton entries are concentrated in Volume 3, with a cross-reference in Volume 4.

## Where to Find the Entries
- Volume 3, pp. 748–749: Primary Hunton lineage — full genealogical entry from William Hunton (~1670) through Eppa Hunton (1822–1908)
- Volume 3, p. 1024: Secondary entry — Thomas Hunton (b. 1702), brother-line to William Hunton II
- Volume 4, p. 567: Cross-reference only — links back to Volume 3, p. 748

Digital Access: familysearch.org/library/books → search "Compendium of American Genealogy" Volume 3

## Huntons Listed

### Primary Line (Vol. 3, pp. 748–749)
- William Hunton (ca. 1670–1730) — Lancaster Co., VA → Richmond Co., VA. First documented American Hunton ancestor. Married Mary Ball — reportedly a sister of Mary Ball Washington (George Washington's mother).
- William Hunton II (1695–1752) — Lancaster Co., VA. Planter. Married Elizabeth Rogers.
- John Hunton (1720–1780) — Lancaster/Fauquier Co., VA. Revolutionary War service. Married Frances Slaughter.
- William Hunton III (1755–1820) — Fauquier Co., VA. Married Sarah Blackwell. Grandfather of Eppa Hunton.
- Eppa Hunton Sr. / Major Eppa Hunton (1780–1846) — Fauquier Co., VA. Married Martha Hunter.
- Eppa Hunton Jr. (Sept. 22, 1822 – Oct. 11, 1908) — Confederate Brigadier General (8th Virginia Infantry). U.S. Congressman (1873–1881). U.S. Senator from Virginia (1892–1895). Married Lucy Caroline Weir.

### Secondary Entry (Vol. 3, p. 1024)
- Thomas Hunton (1702–1768) — Lancaster Co., VA. Brother-line to William Hunton II. Married Ann Jones.

## Notable Facts
- Mary Ball Connection: William Hunton (~1670) reportedly married Mary Ball, believed to be a sister of Mary Ball Washington — mother of President George Washington.
- DAR Patriot Status: William Hunton III referenced under DAR #H487.
- Eppa Hunton Jr. (1855–1932): Son of the General/Senator. Served in Prince William County, Virginia.

## Recommended Verification
1. Access Vol. 3 on FamilySearch or Internet Archive (borrow free)
2. Lancaster County Deed Books (1654–1730) — confirm William Hunton land records
3. Eppa Hunton's Autobiography — available on Internet Archive
4. Virginia Magazine of History and Biography (1925) — Hunton genealogy article
5. DAR Patriot Database — search "Hunton" to confirm #H487

Research conducted via Perplexity AI deep research. Primary source verification recommended.`,
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
  const sanitized = title.replace(/[^a-z0-9\-_ ]/gi, "").trim().replace(/\s+/g, "-");
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${sanitized}.md`;
  a.click();
  URL.revokeObjectURL(url);
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
            Download
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
