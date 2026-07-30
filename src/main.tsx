import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import "./index.css";

import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { NotificationProvider } from "./context/NotificationContext";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <NotificationProvider>
      <FavoritesProvider>
        <CartProvider>
          <App />

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 2500,
              style: {
                borderRadius: "12px",
              },
            }}
          />
        </CartProvider>
      </FavoritesProvider>
    </NotificationProvider>
  </AuthProvider>
);