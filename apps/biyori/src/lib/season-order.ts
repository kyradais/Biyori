/**
 * Canonical season order inside one year: Winter, Spring, Summer, Fall.
 * Sorting by this order keeps a season column chronological instead of
 * alphabetical ("Fall 2001" would otherwise sort before "Spring 2003").
 */
const SEASON_ORDER = ["winter", "spring", "summer", "fall"] as const;

export type SeasonName = (typeof SEASON_ORDER)[number];

export type ParsedSeason = {
	season: SeasonName | null;
	year: number | null;
};

/** Splits a stored season label such as "Fall 2001" into season name and year. */
export function parseSeasonLabel(label: string | null | undefined): ParsedSeason {
	const text = (label ?? "").trim();
	if (!text) {
		return { season: null, year: null };
	}
	const nameMatch = /^([a-z]+)/i.exec(text);
	const name = nameMatch ? nameMatch[1].toLowerCase() : "";
	const season = (SEASON_ORDER as readonly string[]).includes(name) ? (name as SeasonName) : null;
	const yearMatch = /(\d{4})/.exec(text);
	return { season, year: yearMatch ? Number(yearMatch[1]) : null };
}

/**
 * Numeric sort key for a season: `year * 4 + seasonIndex`.
 * `undefined` means "no season known", so the table can push those rows last.
 */
export function seasonSortKey(label: string | null | undefined, year?: number | null): number | undefined {
	const parsed = parseSeasonLabel(label);
	// The label carries the year the UI shows, so it wins over a separate year field.
	const resolvedYear = parsed.year ?? year ?? null;
	if (resolvedYear == null || !Number.isFinite(resolvedYear) || !parsed.season) {
		return undefined;
	}
	return resolvedYear * 4 + SEASON_ORDER.indexOf(parsed.season);
}
