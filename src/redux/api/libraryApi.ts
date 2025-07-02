// src/redux/api/libraryApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { IBookQuery } from "./types";

export const libraryApi = createApi({
  reducerPath: "libraryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include", // if you add cookies later
  }),
  tagTypes: ["Book", "Borrow"],
  endpoints: (builder) => ({
    getBooks: builder.query<IBookQuery[], void>({
      query: () => "books",
      providesTags: ["Book"],
    }),
    // Add more endpoints as needed...
  }),
});

export const { useGetBooksQuery } = libraryApi;
