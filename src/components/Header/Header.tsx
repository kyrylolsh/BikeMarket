import { Link, NavLink } from "react-router-dom";
import {
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiPlusCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

import SearchBar from "../SearchBar/SearchBar";

import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { cart } = useCart();
  const { favorites } = useFavorites();
  const { user, logout } = useAuth();

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  async function handleLogout() {
    try {
      await logout();
      toast.success("Ви вийшли з акаунта");
    } catch {
      toast.error("Помилка виходу");
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-6 px-6">

        {/* Logo */}

        <Link
          to="/"
          className="whitespace-nowrap text-3xl font-extrabold text-green-600"
        >
          🚴 BikeMarket
        </Link>

        {/* Search */}

        <div className="flex-1">
          <SearchBar />
        </div>

        {/* Navigation */}

        <nav className="hidden items-center gap-6 lg:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-green-600"
                : "text-gray-600 hover:text-green-600"
            }
          >
            Головна
          </NavLink>

          <NavLink
            to="/bikes"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-green-600"
                : "text-gray-600 hover:text-green-600"
            }
          >
            Велосипеди
          </NavLink>

          <NavLink
            to="/bike-parts"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-green-600"
                : "text-gray-600 hover:text-green-600"
            }
          >
            Велозапчастини
          </NavLink>
        </nav>

        {/* Sell button */}

        <Link
          to="/sell"
          className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          <FiPlusCircle />
          Продати
        </Link>

        {/* Favorites */}

        <NavLink
          to="/favorites"
          className="relative rounded-lg p-2 transition hover:bg-gray-100"
        >
          <FiHeart size={24} />

          {favorites.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {favorites.length}
            </span>
          )}
        </NavLink>

        {/* Cart */}

        <NavLink
          to="/cart"
          className="relative rounded-lg p-2 transition hover:bg-gray-100"
        >
          <FiShoppingCart size={24} />

          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
              {cartCount}
            </span>
          )}
        </NavLink>

        {/* User */}

        {user ? (
          <div className="flex items-center gap-3">

            <NavLink
              to="/profile"
              className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50"
            >
              <FiUser />
              Профіль
            </NavLink>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-red-500 px-4 py-2 text-red-500 transition hover:bg-red-500 hover:text-white"
            >
              Вийти
            </button>

          </div>
        ) : (
          <div className="flex gap-3">

            <NavLink
              to="/login"
              className="rounded-lg border px-4 py-2 hover:bg-gray-100"
            >
              Увійти
            </NavLink>

            <NavLink
              to="/register"
              className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Реєстрація
            </NavLink>

          </div>
        )}

      </div>
    </header>
  );
}