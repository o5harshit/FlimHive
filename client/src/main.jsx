import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import Auth from "./components/Auth";
import HomePage from "./Pages/HomePage";
import MoviePage from "./Pages/MoviePages";
import AppRoot from "@/config/Approot";
import { Toaster } from "sonner";
import WatchlistPage from "./Pages/WatchlistPage";
import { ProtectedAuthRoute } from "./lib/ProtectedAuthRoute";

// Correct way: Pass an array of routes
const browserRoutes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "movies",
        element: <HomePage />,
      },
      {
        path: "auth",
        element: <ProtectedAuthRoute><Auth /></ProtectedAuthRoute>,
      },
       {
        path: "movies/:id",
        element: <MoviePage/>
      },
        {
        path: "movies/watchlist",
        element: <WatchlistPage/>
      },
      {
        path: "*",
        element: <Navigate to="/auth" replace />,
      },
      {
        path: "/",
        element: <Navigate to="/movies" replace />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AppRoot>
      <RouterProvider router={browserRoutes} />
      <Toaster closeButton />
      </AppRoot>
    </Provider>
  </StrictMode>
);
