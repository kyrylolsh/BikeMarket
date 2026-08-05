import {
  createContext,
  useContext,
  useMemo,
} from "react";

import toast from "react-hot-toast";

import type { Product } from "../types/Product";
import { productService } from "../services/productService";
import { useAuth } from "./AuthContext";
import { useProducts } from "../hooks/useProducts";

interface FavoritesContextType {
  favorites: Product[];

  addToFavorites: (
    product: Product
  ) => Promise<void>;

  removeFromFavorites: (
    product: Product
  ) => Promise<void>;

  isFavorite: (
    product: Product
  ) => boolean;

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

  const { products } = useProducts();

  const favorites = useMemo(() => {
    if (!user) return [];

    return products.filter((product) =>
      product.likedBy?.includes(user.uid)
    );
  }, [products, user]);

  async function addToFavorites(
    product: Product
  ) {
    if (!user) {
      toast.error(
        "Увійдіть в акаунт, щоб додати товар в обране"
      );
      return;
    }

    if (
      product.likedBy?.includes(user.uid)
    ) {
      toast("Товар вже в обраному");
      return;
    }

    try {
      await productService.toggleLike(
        product,
        user.uid
      );

      toast.success(
        `${product.name} додано в обране`
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Не вдалося додати в обране"
      );
    }
  }

  async function removeFromFavorites(
    product: Product
  ) {
    if (!user) return;

    try {
      await productService.toggleLike(
        product,
        user.uid
      );

      toast.success(
        "Товар видалено з обраного"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Не вдалося видалити з обраного"
      );
    }
  }

  function isFavorite(
    product: Product
  ) {
    if (!user) return false;

    return (
      product.likedBy?.includes(
        user.uid
      ) ?? false
    );
  }

  function clearFavorites() {
    // Нічого не робимо.
    // Список автоматично формується з Firebase.
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