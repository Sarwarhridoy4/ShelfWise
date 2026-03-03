import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { ThemeProvider } from "./components/theme-provide.tsx";
import { router } from "./router/router.tsx";

// Lazy load heavy components
const Toaster = lazy(() => import("./components/ui/sonner.tsx").then(module => ({ default: module.Toaster })));
const SmoothCursor = lazy(() => import("./components/ui/smooth-cursor.tsx").then(module => ({ default: module.SmoothCursor })));

// Loading fallback
const ComponentLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Theme Provider */}

    <Provider store={store}>
      <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
        {/*React Router Setup */}
        <RouterProvider router={router} />
        <Suspense fallback={<ComponentLoader />}>
          <Toaster richColors />
        </Suspense>
        <Suspense fallback={<ComponentLoader />}>
          <SmoothCursor />
        </Suspense>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
