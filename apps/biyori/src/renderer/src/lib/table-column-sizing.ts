import type { ColumnOrderState, ColumnSizingState, OnChangeFn, VisibilityState } from "@tanstack/react-table";
import { useState } from "react";
import { z } from "zod";

const STORAGE_PREFIX = "biyori.table-state.";
const sizingSchema = z.record(z.string(), z.number().finite().min(1).max(4000));
const orderSchema = z.array(z.string());
const visibilitySchema = z.record(z.string(), z.boolean());

export interface PersistedTableState {
	columnSizing: ColumnSizingState;
	columnOrder: ColumnOrderState;
	columnVisibility: VisibilityState;
}

export function parseColumnSizing(raw: unknown): ColumnSizingState {
	const parsed = sizingSchema.safeParse(raw);
	return parsed.success ? parsed.data : {};
}

export function readTableState(tableId: string): PersistedTableState {
	try {
		const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${tableId}`);
		if (!raw) {
			const legacySizing = window.localStorage.getItem(`biyori.table-columns.${tableId}`);
			const columnSizing = legacySizing ? parseColumnSizing(JSON.parse(legacySizing)) : {};
			return { columnSizing, columnOrder: [], columnVisibility: {} };
		}
		const data = JSON.parse(raw);
		return {
			columnSizing: sizingSchema.safeParse(data.columnSizing).success ? data.columnSizing : {},
			columnOrder: orderSchema.safeParse(data.columnOrder).success ? data.columnOrder : [],
			columnVisibility: visibilitySchema.safeParse(data.columnVisibility).success ? data.columnVisibility : {},
		};
	} catch {
		return { columnSizing: {}, columnOrder: [], columnVisibility: {} };
	}
}

export function writeTableState(tableId: string, state: PersistedTableState): void {
	window.localStorage.setItem(`${STORAGE_PREFIX}${tableId}`, JSON.stringify(state));
}

export function usePersistedTableState(tableId: string): {
	columnSizing: ColumnSizingState;
	onColumnSizingChange: OnChangeFn<ColumnSizingState>;
	columnOrder: ColumnOrderState;
	onColumnOrderChange: OnChangeFn<ColumnOrderState>;
	columnVisibility: VisibilityState;
	onColumnVisibilityChange: OnChangeFn<VisibilityState>;
} {
	const [state, setState] = useState(() => readTableState(tableId));

	return {
		columnSizing: state.columnSizing,
		onColumnSizingChange: (updater) => {
			setState((prev) => {
				const nextSizing = typeof updater === "function" ? updater(prev.columnSizing) : updater;
				const next = { ...prev, columnSizing: nextSizing };
				writeTableState(tableId, next);
				return next;
			});
		},
		columnOrder: state.columnOrder,
		onColumnOrderChange: (updater) => {
			setState((prev) => {
				const nextOrder = typeof updater === "function" ? updater(prev.columnOrder) : updater;
				const next = { ...prev, columnOrder: nextOrder };
				writeTableState(tableId, next);
				return next;
			});
		},
		columnVisibility: state.columnVisibility,
		onColumnVisibilityChange: (updater) => {
			setState((prev) => {
				const nextVisibility = typeof updater === "function" ? updater(prev.columnVisibility) : updater;
				const next = { ...prev, columnVisibility: nextVisibility };
				writeTableState(tableId, next);
				return next;
			});
		},
	};
}

// Backward compatibility helper
export function usePersistedColumnSizing(tableId: string) {
	const ts = usePersistedTableState(tableId);
	return {
		columnSizing: ts.columnSizing,
		onColumnSizingChange: ts.onColumnSizingChange,
	};
}
