// src/redux/slices/bookListFiltersSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type SortBy = "title" | "author" | "copies";

interface BookListFilterState {
  perPage: number;
  sortBy: SortBy;
  page: number;
}

const initialState: BookListFilterState = {
  perPage: 5,
  sortBy: "title",
  page: 1,
};

const slice = createSlice({
  name: "bookListFilters",
  initialState,
  reducers: {
    setPerPage(state, action: PayloadAction<number>) {
      state.perPage = action.payload;
      state.page = 1; // reset page when page size changes
    },
    setSortBy(state, action: PayloadAction<SortBy>) {
      state.sortBy = action.payload;
      state.page = 1; // reset page when sort order changes
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },
});

export const { setPerPage, setSortBy, setPage } = slice.actions;
export default slice.reducer;
