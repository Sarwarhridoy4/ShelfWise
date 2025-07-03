// src/redux/api/types.ts
/* ---------- ENUMS ------------------------------------------------------- */
export type Genre =
  | "FICTION"
  | "NON_FICTION"
  | "SCIENCE"
  | "HISTORY"
  | "BIOGRAPHY"
  | "FANTASY";

/* ---------- BOOKS ------------------------------------------------------- */
export interface IBookBase {
  title: string;
  author: string;
  genre: string;
  isbn: string;
  description?: string;
  copies: number; // number of copies available
}

export interface IBook extends IBookBase {
  _id: string; // Mongo ObjectId returned as string
  available: boolean; // derived by the server
  createdAt: string;
  updatedAt: string;
}

/** Query‑string options accepted by `GET /api/books` */
export interface IBookQuery {
  filter?: Genre; // ?filter=FICTION
  sortBy?: string; // ?sortBy=title
  sort?: "asc" | "desc"; // ?sort=asc
  limit?: number; // ?limit=20
  page?: number; // not implemented server‑side yet, but typed for future use
}

/* ---------- BORROWS ----------------------------------------------------- */
export interface IBorrowCreatePayload {
  book: string; // book ObjectId
  quantity: number;
  dueDate: string; // ISO date string
}

export interface IBorrowRecord extends IBorrowCreatePayload {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBorrowSummaryItem {
  totalQuantity: number;
  book: {
    title: string;
    isbn: string;
  };
}
export interface IBorrowSummary {
  totalBorrows: number;
  items: IBorrowSummaryItem[];
}
/* ---------- BOOK RESPONSE WRAPPER -------------------------------------- */
export interface IGetBooksResponse {
  data: IBook[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface IGetBookResponse {
  success: boolean;
  message: string;
  data: IBook;
}
