export function filterEditorial<T extends { title: string; category: string; is_published?: boolean }>(rows: T[], search: string, category: string, status = "all") {
  const term = search.trim().toLocaleLowerCase();
  return rows.filter(row => (!term || `${row.title} ${row.category}`.toLocaleLowerCase().includes(term))
    && (!category || row.category === category)
    && (status === "all" || row.is_published === (status === "published")));
}

export function safeLink(value: string) {
  return /^(https?:\/\/|mailto:|\/[^/])/i.test(value) ? value : undefined;
}