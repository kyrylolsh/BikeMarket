import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import type { Product } from "../types/Product";
import { useAuth } from "./AuthContext";

interface FavoritesContextType {
  favorites: Product[];

  addToFavorites: (product: Product) => void;

  removeFromFavorites: (id: string) => void;

  isFavorite: (id: string) => boolean;

  clearFavorites: () => void;
}

const FavoritesContext = createContext<
  FavoritesContextType | undefined
>(undefined);

export function FavoritesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  const [favorites, setFavorites] = useState<Product[]>(() => {
    const savedFavorites =
      localStorage.getItem("favorites");

    return savedFavorites
      ? JSON.parse(savedFavorites)
      : [];
  });

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      localStorage.removeItem("favorites");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  function addToFavorites(product: Product) {
    if (!user) {
      toast.error(
        "Увійдіть в акаунт, щоб додати товар в обране"
      );
      return;
    }

    setFavorites((prev) => {
      const exists = prev.some(
        (item) => item.id === product.id
      );

      if (exists) {
        toast("Товар вже в обраному");
        return prev;
      }

      toast.success(
        `${product.name} додано в обране`
      );

      return [...prev, product];
    });
  }

  function removeFromFavorites(id: string) {
    setFavorites((prev) =>
      prev.filter((item) => item.id !== id)
    );

    toast.success(
      "Товар видалено з обраного"
    );
  }

  function isFavorite(id: string) {
    return favorites.some(
      (item) => item.id === id
    );
  }

  function clearFavorites() {
    setFavorites([]);
    localStorage.removeItem("favorites");
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(
    FavoritesContext
  );

  if (!context) {
    throw new Error(
      "useFavorites must be used inside FavoritesProvider"
    );
  }

  return context;
}