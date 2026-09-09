export function matchesContentQuery(query: string, searchableValues: readonly string[]) {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const searchableText = searchableValues.join(" ").toLocaleLowerCase();
  return terms.every((term) => searchableText.includes(term));
}
