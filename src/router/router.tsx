// src/router.tsx
import { createBrowserRouter } from "react-router";
// Layout
import Main from "@/Layout/Main/Main";
// Top‑level pages
import Home from "@/pages/Home/Home";
// Books
import CreateBook from "@/pages/Books/CreateBook/CreateBook";
import BookDetails from "@/pages/Books/BookDetails/BookDetails";
import BookList from "@/pages/Books/BookList/BookList";
// Borrowing
import BorrowSummary from "@/pages/Borrow/BorrowSummary/BorrowSummary";
import ErrorPage from "@/components/Shared/ErrorPage/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Main,
    errorElement: <ErrorPage />,
    children: [
      // Home (index)
      { index: true, Component: Home },

      // Books
      { path: "books", Component: BookList }, // /books
      { path: "create-book", Component: CreateBook }, // /create-book
      { path: "books/:id", Component: BookDetails }, // /books/123

      // Borrowing

      { path: "borrow-summary", Component: BorrowSummary }, // /borrow-summary
    ],
  },
]);
