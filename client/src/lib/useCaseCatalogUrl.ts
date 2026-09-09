export type CatalogShareState = {
  searchQuery?: string;
  category?: string | null;
  complexity?: string | null;
  aiResultIds?: number[] | null;
};

export function parseCatalogShareState(search: string): CatalogShareState {
  const params = new URLSearchParams(search);
  const ids = (params.get("ids") ?? "")
    .split(",")
    .map(value => Number.parseInt(value, 10))
    .filter(value => Number.isInteger(value) && value > 0);

  return {
    searchQuery: params.get("q")?.trim() || "",
    category: params.get("category")?.trim() || null,
    complexity: params.get("complexity")?.trim() || null,
    aiResultIds: ids.length ? Array.from(new Set(ids)) : null,
  };
}

export function catalogSharePath(state: CatalogShareState) {
  const params = new URLSearchParams();
  if (state.searchQuery?.trim()) params.set("q", state.searchQuery.trim());
  if (state.category) params.set("category", state.category);
  if (state.complexity) params.set("complexity", state.complexity);
  if (state.aiResultIds?.length) params.set("ids", Array.from(new Set(state.aiResultIds)).join(","));
  const query = params.toString();
  return `/use-cases${query ? `?${query}` : ""}`;
}
