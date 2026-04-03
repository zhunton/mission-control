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
