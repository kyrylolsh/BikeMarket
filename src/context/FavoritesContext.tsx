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

  const [favorites, setFavorites] = useState<Product[]>([]);

  // Завантаження обраного конкретного користувача
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    const saved = localStorage.getItem(
      `favorites_${user.uid}`
    );

    setFavorites(saved ? JSON.parse(saved) : []);
  }, [user]);

  // Збереження
  useEffect(() => {
    if (!user) return;

    localStorage.setItem(
      `favorites_${user.uid}`,
      JSON.stringify(favorites)
    );
  }, [favorites, user]);

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