import type { ReactNode } from "react";
import { safeLink } from "@/lib/editorial";
type Node = { type?: string; text?: string; content?: Node[]; attrs?: { level?: number; href?: string }; marks?: { type: string; attrs?: { href?: string } }[] };
function render(node: Node, key: number): ReactNode {
  let children: ReactNode = node.text ?? node.content?.map(render);
  for (const mark of node.marks ?? []) {
    if (mark.type === "bold") children = <strong>{children}</strong>;
    if (mark.type === "italic") children = <em>{children}</em>;
    if (mark.type === "strike") children = <s>{children}</s>;
    if (mark.type === "link") children = <a href={safeLink(mark.attrs?.href ?? "")}>{children}</a>;
  }
  switch (node.type) {
    case "paragraph": return <p key={key}>{children || <br />}</p>;
    case "heading": return node.attrs?.level === 3 ? <h3 key={key}>{children}</h3> : <h2 key={key}>{children}</h2>;
    case "bulletList": return <ul key={key}>{children}</ul>;
    case "orderedList": return <ol key={key}>{children}</ol>;
    case "listItem": return <li key={key}>{children}</li>;
    case "blockquote": return <blockquote key={key}>{children}</blockquote>;
    case "hardBreak": return <br key={key} />;
    case "horizontalRule": return <hr key={key} />;
    default: return <span key={key}>{children}</span>;
  }
}
export function RichContent({ value, fallback = "" }: { value: string; fallback?: string }) {
  try {
    const doc = JSON.parse(value) as Node;
    if (doc.type === "doc" && Array.isArray(doc.content)) return <div className="rich-content">{doc.content.map(render)}</div>;
  } catch { /* Older entries remain plain text. */ }
  return <div className="rich-content">{fallback.split(/\n{2,}/).map((text, i) => <p key={i}>{text}</p>)}</div>;
}