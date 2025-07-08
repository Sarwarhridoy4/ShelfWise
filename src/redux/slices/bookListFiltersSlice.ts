// src/redux/slices/bookListFiltersSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type SortBy = "title" | "author" | "copies";

export interface BookListFilterState {
  perPage: number;
  sortBy: SortBy;
  page: number;
}

/* ---------- helper ---------- */
export function filtersStateFromUrl(): BookListFilterState {
  // SSR-safe: fall back to defaults if window is undefined
  if (typeof window === "undefined") {
    return { perPage: 5, sortBy: "title", page: 1 };
  }

  const params = new URLSearchParams(window.location.search);
  return {
    perPage: Number(params.get("limit")) || 5,
    sortBy: (params.get("sort") as SortBy) || "title",
    page: Number(params.get("page")) || 1,
  };
}

/* ---------- slice ---------- */
const slice = createSlice({
  name: "bookListFilters",
  initialState: filtersStateFromUrl(), // <- seeded from URL
  reducers: {
    setPerPage(state, { payload }: PayloadAction<number>) {
      state.perPage = payload;
      if (payload === 0) state.page = 1;
    },
    setSortBy(state, { payload }: PayloadAction<SortBy>) {
      if (state.sortBy !== payload) {
        state.sortBy = payload;
        state.page = 1;
      }
    },
    setPage(state, { payload }: PayloadAction<number>) {
      state.page = payload;
    },
  },
});

export const { setPerPage, setSortBy, setPage } = slice.actions;
export default slice.reducer;
