export type IBookQuery = {
  filter?: string; // e.g., genre
  sortBy?: string;
  sort?: "asc" | "desc";
  limit?: number; // items per page
  page?: number; // page number, 1‑based
};

export type Paginated<T> = {
  data: T[];
  meta: { page: number; limit: number; totalPages: number; totalItems: number };
};