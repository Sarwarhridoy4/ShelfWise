// src/router.tsx
import { createBrowserRouter } from "react-router";
import { Suspense, lazy } from "react";

// Layout
import Main from "@/Layout/Main/Main";

// Lazy-loaded pages
const Home = lazy(() => import("@/pages/Home/Home"));
const CreateBook = lazy(() => import("@/pages/Books/CreateBook/CreateBook"));
const BookDetails = lazy(() => import("@/pages/Books/BookDetails/BookDetails"));
const BookList = lazy(() => import("@/pages/Books/BookList/BookList"));
const BorrowSummary = lazy(() => import("@/pages/Borrow/BorrowSummary/BorrowSummary"));

// Lazy load ErrorPage for better error handling
const ErrorPage = lazy(() => import("@/components/Shared/ErrorPage/ErrorPage"));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Main,
    errorElement: <Suspense fallback={<PageLoader />}><ErrorPage /></Suspense>,
    children: [
      // Home (index)
      { index: true, element: <Suspense fallback={<PageLoader />}><Home /></Suspense> },

      // Books
      { path: "books", element: <Suspense fallback={<PageLoader />}><BookList /></Suspense> },
      { path: "create-book", element: <Suspense fallback={<PageLoader />}><CreateBook /></Suspense> },
      { path: "books/:id", element: <Suspense fallback={<PageLoader />}><BookDetails /></Suspense> },

      // Borrowing
      { path: "borrow-summary", element: <Suspense fallback={<PageLoader />}><BorrowSummary /></Suspense> },
    ],
  },
]);
