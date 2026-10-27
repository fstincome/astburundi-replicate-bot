<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Data access is browser-side only (no createServerFn); RLS is the security boundary. Why: the site must also ship as a static export for cPanel shared hosting via `vite.static.config.ts` (output `dist/client`, plus `public/.htaccess` SPA fallback).
- Editorial rich content uses Tiptap JSON and a React allowlist renderer, never raw HTML; legacy plain text remains readable to preserve existing entries safely.
