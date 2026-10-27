import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Heading2, List, ListOrdered, Quote, Undo2, Redo2, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
export function CmsRichEditor({ value, fallback, onChange }: { value: string; fallback: string; onChange: (json: string, text: string) => void }) {
  let initial;
  try { initial = JSON.parse(value); } catch { initial = { type: "doc", content: fallback.split(/\n+/).map(text => ({ type: "paragraph", content: text ? [{ type: "text", text }] : [] })) }; }
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false } })],
    immediatelyRender: false, content: initial,
    onUpdate: ({ editor }) => onChange(JSON.stringify(editor.getJSON()), editor.getText()),
  });
  if (!editor) return <p>Chargement de l’éditeur…</p>;
  const tools = [
    { label: "Gras", icon: Bold, active: editor.isActive("bold"), run: () => editor.chain().focus().toggleBold().run() },
    { label: "Italique", icon: Italic, active: editor.isActive("italic"), run: () => editor.chain().focus().toggleItalic().run() },
    { label: "Titre", icon: Heading2, active: editor.isActive("heading"), run: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "Liste à puces", icon: List, active: editor.isActive("bulletList"), run: () => editor.chain().focus().toggleBulletList().run() },
    { label: "Liste numérotée", icon: ListOrdered, active: editor.isActive("orderedList"), run: () => editor.chain().focus().toggleOrderedList().run() },
    { label: "Citation", icon: Quote, active: editor.isActive("blockquote"), run: () => editor.chain().focus().toggleBlockquote().run() },
    { label: "Lien", icon: LinkIcon, active: editor.isActive("link"), run: () => { const href = window.prompt("Adresse du lien (https://…)", editor.getAttributes("link").href ?? "https://"); if (href === "") editor.chain().focus().unsetLink().run(); else if (href && /^https?:\/\//i.test(href)) editor.chain().focus().setLink({ href }).run(); } },
    { label: "Annuler", icon: Undo2, run: () => editor.chain().focus().undo().run() },
    { label: "Rétablir", icon: Redo2, run: () => editor.chain().focus().redo().run() },
  ];
  return <div className="cms-rich-editor"><div className="cms-format-tools" role="toolbar" aria-label="Mise en forme">{tools.map(tool => <Button key={tool.label} type="button" size="icon" variant={tool.active ? "secondary" : "ghost"} title={tool.label} aria-label={tool.label} aria-pressed={tool.active} onClick={tool.run}><tool.icon /></Button>)}</div><EditorContent editor={editor} aria-label="Contenu éditorial" /></div>;
}