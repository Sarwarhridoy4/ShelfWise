// src/redux/api/libraryApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  IBook,
  IBookBase,
  IBookQuery,
  IBorrowCreatePayload,
  IBorrowRecord,
  IGetBookResponse,
  IGetBooksResponse,
} from "./types";

export const libraryApi = createApi({
  reducerPath: "libraryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL, // e.g. https://…/api
    credentials: "include",
  }),
  tagTypes: ["Book", "Borrow"],

  endpoints: (builder) => ({
    /* ───────────── BOOKS ───────────── */

    // GET /books
    getBooks: builder.query<IGetBooksResponse, IBookQuery | void>({
      query: (params) => {
        const qs =
          params && Object.keys(params).length
            ? `?${new URLSearchParams(
                params as string | Record<string, string>
              )}`
            : "";
        return `/books${qs}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Book" as const,
                id: _id,
              })),
              { type: "Book", id: "LIST" },
            ]
          : [{ type: "Book", id: "LIST" }],
    }),

    /* GET /books/:id */
    getBook: builder.query<IGetBookResponse, string>({
      query: (id) => `books/${id}`,
      providesTags: (_result, _error, id) => [
        { type: "Book", id },
        { type: "Book", id: "LIST" },
      ],
    }),

    // POST /books
    addBook: builder.mutation<IBook, IBookBase>({
      query: (body) => ({ url: "books", method: "POST", body }),
      invalidatesTags: [
        { type: "Book", id: "LIST" },
        { type: "Borrow", id: "LIST" }, // Invalidate borrow summary too
      ],
    }),

    // PUT /books/:id
    updateBook: builder.mutation<
      IBook,
      { id: string; body: Partial<IBookBase> }
    >({
      query: ({ id, body }) => ({ url: `books/${id}`, method: "PUT", body }),
      invalidatesTags: [
        { type: "Book", id: "LIST" },
        { type: "Borrow", id: "LIST" }, // Invalidate borrow summary too
      ],
    }),

    // DELETE /books/:id
    deleteBook: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `books/${id}`, method: "DELETE" }),
      invalidatesTags: [
        { type: "Book", id: "LIST" },
        { type: "Borrow", id: "LIST" }, // Invalidate borrow summary too
      ],
    }),

    /* ─────────── BORROW / SUMMARY ───── */

    // POST /borrow
    borrowBook: builder.mutation<IBorrowRecord, IBorrowCreatePayload>({
      query: (body) => ({ url: "borrow", method: "POST", body }),
      invalidatesTags: [
        { type: "Borrow", id: "LIST" },
        { type: "Book", id: "LIST" }, // copies changed → refresh books too
      ],
    }),

    // GET /borrow
    getBorrowSummary: builder.query<
      { title: string; isbn: string; totalBorrowed: number }[],
      void
    >({
      query: () => "borrow",
      transformResponse: (response: {
        success: boolean;
        message: string;
        data: {
          book: { title: string; isbn: string };
          totalQuantity: number;
        }[];
      }) =>
        response.data.map((entry) => ({
          title: entry.book.title,
          isbn: entry.book.isbn,
          totalBorrowed: entry.totalQuantity,
        })),
      providesTags: [{ type: "Borrow", id: "LIST" }],
    }),
  }),
});

/* ─────────── HOOK EXPORTS ─────────── */
export const {
  useGetBooksQuery,
  useGetBookQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useBorrowBookMutation,
  useGetBorrowSummaryQuery,
} = libraryApi;
