import { expect, test } from "bun:test";
import { createTable, getCoreRowModel, getSortedRowModel } from "@tanstack/react-table";
import { seasonSortKey } from "../../../lib/season-order";

type Row = { season: string };

const columns = [
	{
		id: "season",
		accessorFn: (row: Row) => seasonSortKey(row.season),
		sortUndefined: "last" as const,
	},
];

function sorted(seasonValues: string[], desc: boolean): string[] {
	const data = seasonValues.map((season) => ({ season }));
	const table = createTable<Row>({
		data,
		columns,
		state: { sorting: [{ id: "season", desc }] },
		onStateChange: () => {},
		onSortingChange: () => {},
		renderFallbackValue: null,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});
	return table.getSortedRowModel().rows.map((row) => row.original.season);
}

const SEASONS = ["Fall 2004", "Spring 2003", "Fall 2001", "Summer 2001", "Winter 2003", "Spring 2001", "Summer 2002", "Winter 2001", "Fall 2002"];

test("table sorts season chronologically ascending", () => {
	expect(sorted(SEASONS, false)).toEqual(["Winter 2001", "Spring 2001", "Summer 2001", "Fall 2001", "Summer 2002", "Fall 2002", "Winter 2003", "Spring 2003", "Fall 2004"]);
});

test("table sorts season descending", () => {
	expect(sorted(SEASONS, true)).toEqual(["Fall 2004", "Spring 2003", "Winter 2003", "Fall 2002", "Summer 2002", "Fall 2001", "Summer 2001", "Spring 2001", "Winter 2001"]);
});

test("table pushes unknown seasons last", () => {
	expect(sorted(["Fall 2001", "", "Winter 2001"], false)).toEqual(["Winter 2001", "Fall 2001", ""]);
});
