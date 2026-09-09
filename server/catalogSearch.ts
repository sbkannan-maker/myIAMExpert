import { useCases30 } from "../client/src/lib/useCases30";

type SearchPayload = {
  interpretation?: unknown;
  recommendedIds?: unknown;
  suggestedRefinement?: unknown;
};

export const catalogForSearch = useCases30.map((useCase) => ({
  id: useCase.id,
  title: useCase.title,
  category: useCase.category,
  complexity: useCase.complexity,
  businessRequirement: useCase.businessRequirement,
  keywords: useCase.keywords,
}));

export function normalizeSearchResponse(payload: SearchPayload) {
  const validIds = new Set(catalogForSearch.map((useCase) => useCase.id));
  const recommendedIds = Array.isArray(payload.recommendedIds)
    ? payload.recommendedIds.filter((id): id is number => Number.isInteger(id) && validIds.has(id)).slice(0, 8)
    : [];

  return {
    interpretation: typeof payload.interpretation === "string" ? payload.interpretation.slice(0, 280) : "Relevant IdentityIQ implementation patterns",
    recommendedIds: Array.from(new Set(recommendedIds)),
    suggestedRefinement: typeof payload.suggestedRefinement === "string" ? payload.suggestedRefinement.slice(0, 180) : "",
  };
}
