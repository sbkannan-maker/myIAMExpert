export type VisitorOrigin = {
  anonymizedLabel: string;
  ipPrefix: string;
  countryCode: string | null;
  region: string | null;
  views: number;
};

export function createVisitorOriginKey(origin: VisitorOrigin, index: number) {
  return `${origin.ipPrefix}|${origin.countryCode ?? ""}|${origin.region ?? ""}|${origin.views}|${index}`;
}

export function getVisitorCountryName(countryCode: string | null | undefined) {
  if (!countryCode) return "Country unavailable";
  const normalized = countryCode.trim().toUpperCase();
  if (normalized === "UNAVAILABLE") return "Country unavailable";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(normalized) ?? normalized;
  } catch {
    return normalized;
  }
}

const providerRegionNames: Record<string, string> = {
  "IN-TN": "Tamil Nadu", "IN-KA": "Karnataka", "IN-MH": "Maharashtra", "IN-DL": "Delhi", "IN-KL": "Kerala", "IN-TG": "Telangana", "IN-WB": "West Bengal", "IN-AP": "Andhra Pradesh", "IN-GJ": "Gujarat", "IN-HR": "Haryana", "IN-MP": "Madhya Pradesh", "IN-OR": "Odisha", "IN-UP": "Uttar Pradesh", "IN-RJ": "Rajasthan", "IN-PB": "Punjab", "IN-BR": "Bihar", "IN-AS": "Assam",
  "US-CA": "California", "US-NY": "New York", "US-TX": "Texas", "US-WA": "Washington", "US-FL": "Florida", "US-MA": "Massachusetts", "US-IL": "Illinois", "US-VA": "Virginia", "US-CO": "Colorado", "US-OR": "Oregon", "US-GA": "Georgia", "US-NJ": "New Jersey",
  "CA-ON": "Ontario", "CA-QC": "Quebec", "CA-BC": "British Columbia", "CA-AB": "Alberta", "GB-ENG": "England", "GB-SCT": "Scotland", "GB-WLS": "Wales", "GB-NIR": "Northern Ireland", "AU-NSW": "New South Wales", "AU-VIC": "Victoria", "AU-QLD": "Queensland", "AU-WA": "Western Australia", "AU-SA": "South Australia", "NZ-AUK": "Auckland", "DE-BE": "Berlin", "DE-BY": "Bavaria", "FR-IDF": "Île-de-France", "FR-ARA": "Auvergne-Rhône-Alpes", "ES-MD": "Community of Madrid", "IT-LA": "Lazio", "NL-NH": "North Holland", "CH-ZH": "Zürich", "SE-AB": "Stockholm County", "BR-SP": "São Paulo", "BR-RJ": "Rio de Janeiro", "BR-MG": "Minas Gerais", "MX-CMX": "Mexico City", "MX-JAL": "Jalisco", "JP-13": "Tokyo", "JP-27": "Osaka", "CN-BJ": "Beijing", "CN-SH": "Shanghai", "CN-GD": "Guangdong", "AE-DU": "Dubai",
};

export function getVisitorRegionName(countryCode: string | null | undefined, region: string | null | undefined) {
  if (!region || region === "Unavailable") return null;
  const normalizedRegion = region.trim().toUpperCase();
  const providerName = countryCode ? providerRegionNames[`${countryCode.toUpperCase()}-${normalizedRegion}`] : undefined;
  if (providerName) return providerName;
  try {
    const subdivision = countryCode ? new Intl.DisplayNames(["en"], { type: "region" }).of(`${countryCode.toUpperCase()}-${normalizedRegion}`) : null;
    return subdivision && subdivision !== `${countryCode?.toUpperCase()}-${normalizedRegion}` ? subdivision : region;
  } catch {
    return region;
  }
}

export function formatVisitorLocation(countryCode: string | null | undefined, region: string | null | undefined) {
  const country = countryCode ? getVisitorCountryName(countryCode) : null;
  const safeRegion = getVisitorRegionName(countryCode, region);
  return [country, safeRegion].filter(Boolean).join(" · ") || "Location unavailable";
}

export function formatVisitorGeographyLabel(label: string) {
  const [countryCode, ...rest] = label.split(" · ");
  return countryCode === "Unavailable" ? "Location unavailable" : formatVisitorLocation(countryCode, rest.join(" · "));
}

export type VisitorAnalyticsSnapshot = {
  totalViews: number;
  totalVisitors: number;
  daily: Array<{ day: string; views: number }>;
  pages: Array<{ path: string; views: number }>;
  regions: Array<{ label: string; views: number }>;
  visitorOrigins: VisitorOrigin[];
  countryMap: Array<{ countryCode: string; views: number }>;
  coverageHistory: Array<{ day: string; total: number; countryEvents: number; regionEvents: number }>;
};

export type VisitorAnalyticsRange = {
  startDate: string;
  endDate: string;
};

export type VisitorOriginTrendPoint = {
  day: string;
  countries: Array<{ label: string; views: number }>;
  regions: Array<{ label: string; views: number }>;
};

export function buildVisitorOriginTrend(trend: VisitorOriginTrendPoint[], dimension: "country" | "region", filter: string) {
  const totals = new Map<string, number>();
  trend.forEach((item) => {
    const values = dimension === "country" ? item.countries : item.regions;
    values.forEach((value) => totals.set(value.label, (totals.get(value.label) ?? 0) + value.views));
  });
  const rawLabels = filter === "all" ? Array.from(totals.entries()).sort(([, a], [, b]) => b - a).slice(0, 5).map(([label]) => label) : [filter];
  const labels = rawLabels.map((label) => dimension === "country" ? getVisitorCountryName(label) : label);
  const data = trend.map((item) => {
    const values = dimension === "country" ? item.countries : item.regions;
    const row: Record<string, string | number> = { day: item.day.slice(5) };
    rawLabels.forEach((label, index) => { row[labels[index]] = values.find((value) => value.label === label)?.views ?? 0; });
    return row;
  });
  return { data, labels };
}

function escapeCsv(value: string | number | null) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

/**
 * Export the same aggregate-only data shown in the owner dashboard.
 * Raw IP addresses, identities, exact locations, and device fields are not
 * available to this helper and therefore cannot enter the exported file.
 */
export function visitorAnalyticsToCsv(snapshot: VisitorAnalyticsSnapshot, range: VisitorAnalyticsRange) {
  const rows = [
    ["section", "label", "views", "country_or_region"],
    ["summary", `Total views (${range.startDate} to ${range.endDate})`, snapshot.totalViews, ""],
    ["summary", `Total visitors (${range.startDate} to ${range.endDate})`, snapshot.totalVisitors, ""],
    ...snapshot.daily.map((item) => ["daily", item.day, item.views, ""] as const),
    ...snapshot.pages.map((item) => ["page", item.path, item.views, ""] as const),
    ...snapshot.regions.map((item) => ["region", item.label, item.views, ""] as const),
    ...snapshot.visitorOrigins.map((item) => ["visitor_origin", `${item.anonymizedLabel} · ${item.ipPrefix}`, item.views, [item.countryCode, item.region].filter(Boolean).join(" · ")] as const),
  ];

  return `${rows.map((row) => row.map(escapeCsv).join(",")).join("\n")}\n`;
}
