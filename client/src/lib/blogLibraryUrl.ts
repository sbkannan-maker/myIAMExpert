export type BlogLibraryUrlState = {
  query: string;
  category: string;
  sortOrder: "newest" | "oldest";
};

export function parseBlogLibraryUrlState(search: string): BlogLibraryUrlState {
  const params = new URLSearchParams(search);
  return {
    query: params.get("q") ?? "",
    category: params.get("category") ?? "All categories",
    sortOrder: params.get("sort") === "oldest" ? "oldest" : "newest",
  };
}

export function serializeBlogLibraryUrlState(state: BlogLibraryUrlState): string {
  const params = new URLSearchParams();
  if (state.query.trim()) params.set("q", state.query.trim());
  if (state.category !== "All categories") params.set("category", state.category);
  if (state.sortOrder !== "newest") params.set("sort", state.sortOrder);
  const value = params.toString();
  return value ? `?${value}` : "";
}
