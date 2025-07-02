// src/router.tsx
import { createBrowserRouter } from "react-router"; // ✅ v7 core

// Layout
import Main from "@/Layout/Main/Main";

// Top‑level pages
import Home from "@/pages/Home/Home";

// Books
import CreateBook from "@/pages/Books/CreateBook/CreateBook";
import BookDetails from "@/pages/Books/BookDetails/BookDetails";
import EditBook from "@/pages/Books/EditBook/EditBook";
import BookList from "@/pages/Books/BookList/BookList";

// Borrowing
import BorrowBook from "@/pages/Borrow/BorrowBook/BorrowBook";
import BorrowSummary from "@/pages/Borrow/BorrowSummary/BorrowSummary";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Main,
    children: [
      // Home (index)
      { index: true, Component: Home },

      // Books
      { path: "books", Component: BookList }, // /books
      { path: "create-book", Component: CreateBook }, // /create-book
      { path: "books/:id", Component: BookDetails }, // /books/123
      { path: "edit-book/:id", Component: EditBook }, // /edit-book/123

      // Borrowing
      { path: "borrow/:bookId", Component: BorrowBook }, // /borrow/123
      { path: "borrow-summary", Component: BorrowSummary }, // /borrow-summary
    ],
  },
]);
