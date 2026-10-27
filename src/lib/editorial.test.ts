import { describe, expect, it } from "vitest";
import { filterEditorial, safeLink } from "./editorial";
const rows = [
  { title: "Rapport annuel", category: "Rapports", is_published: true },
  { title: "Rapport provisoire", category: "Rapports", is_published: false },
  { title: "Travaux", category: "Appels d’offres", is_published: true },
];
describe("CMS editorial", () => {
  it("filters publications by their saved category", () => { expect(filterEditorial(rows, "", "Rapports")).toEqual(rows.slice(0, 2)); });
  it("keeps drafts separate from published content", () => { expect(filterEditorial(rows, "", "", "draft")).toEqual([rows[1]]); });
  it("rejects executable links in rich content", () => { expect(safeLink("javascript:alert(1)")).toBeUndefined(); expect(safeLink("https://astburundi.com")).toBe("https://astburundi.com"); });
});