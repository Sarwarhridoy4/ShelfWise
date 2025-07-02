import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./router/router.ts";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { ThemeProvider } from "./components/theme-provide.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Theme Provider */}

    <Provider store={store}>
      <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
        {/*React Router Setup */}
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
