import { describe, expect, test } from "bun:test";
import { parseSeasonLabel, seasonSortKey } from "./season-order";

describe("parseSeasonLabel", () => {
	test("splits season name and year", () => {
		expect(parseSeasonLabel("Fall 2001")).toEqual({ season: "fall", year: 2001 });
		expect(parseSeasonLabel("WINTER 2026")).toEqual({ season: "winter", year: 2026 });
		expect(parseSeasonLabel("")).toEqual({ season: null, year: null });
		expect(parseSeasonLabel(null)).toEqual({ season: null, year: null });
	});
});

describe("seasonSortKey", () => {
	test("orders seasons chronologically with winter first", () => {
		const labels = ["Fall 2004", "Spring 2003", "Fall 2001", "Summer 2001", "Winter 2003", "Spring 2001", "Summer 2002", "Winter 2001", "Fall 2002"];
		const sorted = [...labels].sort((a, b) => (seasonSortKey(a) ?? 0) - (seasonSortKey(b) ?? 0));
		expect(sorted).toEqual(["Winter 2001", "Spring 2001", "Summer 2001", "Fall 2001", "Summer 2002", "Fall 2002", "Winter 2003", "Spring 2003", "Fall 2004"]);
	});

	test("sorts a later year before an earlier one", () => {
		expect((seasonSortKey("Winter 2002") ?? 0) > (seasonSortKey("Fall 2001") ?? 0)).toBe(true);
	});

	test("uses an explicit year when the label has none", () => {
		expect(seasonSortKey("FALL", 2023)).toBe(2023 * 4 + 3);
	});

	test("prefers the year shown in the label", () => {
		expect(seasonSortKey("Fall 2001", 2023)).toBe(2001 * 4 + 3);
	});

	test("returns undefined for unknown seasons", () => {
		expect(seasonSortKey("")).toBeUndefined();
		expect(seasonSortKey(null)).toBeUndefined();
		expect(seasonSortKey("Unknown 2001")).toBeUndefined();
	});
});
