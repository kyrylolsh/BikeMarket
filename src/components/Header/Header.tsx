import { Link, NavLink } from "react-router-dom";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
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

  const favoritesCount = favorites.length;

  async function handleLogout() {
    try {
      await logout();
      toast.success("Ви вийшли з акаунта");
    } catch {
      toast.error("Помилка виходу");
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link
          to="/"
          className="text-3xl font-extrabold text-green-600"
        >
          🚴 BikeMarket
        </Link>

        <div className="hidden md:block">
          <SearchBar />
        </div>

        <nav className="flex items-center gap-6">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "font-bold text-green-600"
                : "hover:text-green-600"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              isActive
                ? "font-bold text-green-600"
                : "hover:text-green-600"
            }
          >
            Catalog
          </NavLink>

          <NavLink
            to="/sell"
            className={({ isActive }) =>
              isActive
                ? "font-bold text-green-600"
                : "hover:text-green-600"
            }
          >
            Sell
          </NavLink>

          <NavLink
            to="/favorites"
            className="relative"
          >
            <FiHeart size={22} />

            {favoritesCount > 0 && (
              <span className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {favoritesCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/cart"
            className="relative"
          >
            <FiShoppingCart size={22} />

            {cartCount > 0 && (
              <span className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
                {cartCount}
              </span>
            )}
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/profile"
                className="font-semibold text-green-600"
              >
                {user.email}
              </NavLink>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Вийти
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="hover:text-green-600"
              >
                Вхід
              </NavLink>

              <NavLink
                to="/register"
                className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Реєстрація
              </NavLink>
            </>
          )}

        </nav>

      </div>
    </header>
  );
}