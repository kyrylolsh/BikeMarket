import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiPlusCircle,
  FiMenu,
  FiX,
  FiChevronDown,
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

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  async function handleLogout() {
    try {
      await logout();

      setProfileOpen(false);

      toast.success("Ви вийшли з акаунта");
    } catch {
      toast.error("Помилка виходу");
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">

      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-6">

        {/* Logo */}

        <Link
          to="/"
          className="shrink-0 text-3xl font-extrabold text-green-600"
        >
          🚴 BikeMarket
        </Link>

        {/* Desktop navigation */}

        <nav className="hidden xl:flex items-center gap-6">

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

        {/* Search */}

        <div className="min-w-0 flex-1">
          <SearchBar />
        </div>
                {/* Продати */}

                <Link
                  to="/sell"
                  className="hidden lg:flex shrink-0 items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  <FiPlusCircle />
                  Продати
                </Link>

                {/* Обране */}

                <NavLink
                  to="/favorites"
                  className="relative shrink-0 rounded-lg p-2 transition hover:bg-gray-100"
                >
                  <FiHeart size={24} />

                  {favorites.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {favorites.length}
                    </span>
                  )}
                </NavLink>

                {/* Кошик */}

                <NavLink
                  to="/cart"
                  className="relative shrink-0 rounded-lg p-2 transition hover:bg-gray-100"
                >
                  <FiShoppingCart size={24} />

                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
                      {cartCount}
                    </span>
                  )}
                </NavLink>

                {/* Блок акаунта */}

                {/* Account */}

                <div className="relative shrink-0">

                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 rounded-xl border px-3 py-2 transition hover:bg-gray-100"
                  >
                    <FiUser size={20} />

                    {user && <FiChevronDown />}
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-14 w-72 overflow-hidden rounded-2xl border bg-white shadow-2xl">

                      {user ? (
                        <>
                          <NavLink
                            to="/profile"
                            onClick={() => setProfileOpen(false)}
                            className="block px-5 py-4 hover:bg-gray-50"
                          >
                            👤 Профіль
                          </NavLink>

                          <NavLink
                            to="/my-listings"
                            onClick={() => setProfileOpen(false)}
                            className="block px-5 py-4 hover:bg-gray-50"
                          >
                            📦 Мої оголошення
                          </NavLink>

                          <NavLink
                            to="/orders"
                            onClick={() => setProfileOpen(false)}
                            className="block px-5 py-4 hover:bg-gray-50"
                          >
                            🧾 Мої замовлення
                          </NavLink>

                          <NavLink
                            to="/seller-orders"
                            onClick={() => setProfileOpen(false)}
                            className="block px-5 py-4 hover:bg-gray-50"
                          >
                            🛒 Замовлення клієнтів
                          </NavLink>

                          <NavLink
                            to="/messages"
                            onClick={() => setProfileOpen(false)}
                            className="block px-5 py-4 hover:bg-gray-50"
                          >
                            💬 Повідомлення
                          </NavLink>

                          <button
                            onClick={handleLogout}
                            className="w-full border-t px-5 py-4 text-left text-red-600 transition hover:bg-red-500 hover:text-white"
                          >
                            🚪 Вийти
                          </button>
                        </>
                      ) : (
                        <>
                          <NavLink
                            to="/login"
                            onClick={() => setProfileOpen(false)}
                            className="block px-5 py-4 hover:bg-gray-50"
                          >
                            🔑 Увійти
                          </NavLink>

                          <NavLink
                            to="/register"
                            onClick={() => setProfileOpen(false)}
                            className="block px-5 py-4 hover:bg-gray-50"
                          >
                            ✍️ Реєстрація
                          </NavLink>
                        </>
                      )}

                    </div>
                  )}

                </div>

                {/* Бургер */}

                <button
                  onClick={() =>
                    setMobileOpen(true)
                  }
                  className="xl:hidden rounded-lg p-2 hover:bg-gray-100"
                >
                  <FiMenu size={28} />
                </button>

              </div>
                    {/* Mobile menu */}

                    {mobileOpen && (
                      <>
                        <div
                          onClick={() => setMobileOpen(false)}
                          className="fixed inset-0 z-40 bg-black/40"
                        />

                        <aside className="fixed right-0 top-0 z-50 flex h-screen w-80 flex-col bg-white shadow-2xl">

                          <div className="flex items-center justify-between border-b p-6">

                            <h2 className="text-2xl font-bold">
                              Меню
                            </h2>

                            <button
                              onClick={() => setMobileOpen(false)}
                            >
                              <FiX size={30} />
                            </button>

                          </div>

                          <div className="flex flex-1 flex-col gap-2 p-6">

                            <NavLink
                              to="/"
                              onClick={() => setMobileOpen(false)}
                              className="rounded-xl px-4 py-3 hover:bg-gray-100"
                            >
                              🏠 Головна
                            </NavLink>

                            <NavLink
                              to="/bikes"
                              onClick={() => setMobileOpen(false)}
                              className="rounded-xl px-4 py-3 hover:bg-gray-100"
                            >
                              🚲 Велосипеди
                            </NavLink>

                            <NavLink
                              to="/bike-parts"
                              onClick={() => setMobileOpen(false)}
                              className="rounded-xl px-4 py-3 hover:bg-gray-100"
                            >
                              🛠 Велозапчастини
                            </NavLink>

                            <NavLink
                              to="/sell"
                              onClick={() => setMobileOpen(false)}
                              className="rounded-xl bg-green-600 px-4 py-3 text-white hover:bg-green-700"
                            >
                              ➕ Продати
                            </NavLink>

                            <hr className="my-3" />

                            {user ? (
                              <>
                                <NavLink
                                  to="/profile"
                                  onClick={() => setMobileOpen(false)}
                                  className="rounded-xl px-4 py-3 hover:bg-gray-100"
                                >
                                  👤 Профіль
                                </NavLink>

                                <NavLink
                                  to="/my-listings"
                                  onClick={() => setMobileOpen(false)}
                                  className="rounded-xl px-4 py-3 hover:bg-gray-100"
                                >
                                  📦 Мої оголошення
                                </NavLink>

                                <NavLink
                                  to="/orders"
                                  onClick={() => setMobileOpen(false)}
                                  className="rounded-xl px-4 py-3 hover:bg-gray-100"
                                >
                                  🧾 Мої замовлення
                                </NavLink>

                                <NavLink
                                  to="/seller-orders"
                                  onClick={() => setMobileOpen(false)}
                                  className="rounded-xl px-4 py-3 hover:bg-gray-100"
                                >
                                  🛒 Замовлення клієнтів
                                </NavLink>

                                <NavLink
                                  to="/messages"
                                  onClick={() => setMobileOpen(false)}
                                  className="rounded-xl px-4 py-3 hover:bg-gray-100"
                                >
                                  💬 Повідомлення
                                </NavLink>

                                <button
                                  onClick={handleLogout}
                                  className="mt-4 rounded-xl border border-red-500 px-4 py-3 text-left text-red-600 transition hover:bg-red-500 hover:text-white"
                                >
                                  🚪 Вийти
                                </button>
                              </>
                            ) : (
                              <>
                                <NavLink
                                  to="/login"
                                  onClick={() => setMobileOpen(false)}
                                  className="rounded-xl border px-4 py-3 hover:bg-gray-100"
                                >
                                  Увійти
                                </NavLink>

                                <NavLink
                                  to="/register"
                                  onClick={() => setMobileOpen(false)}
                                  className="rounded-xl bg-green-600 px-4 py-3 text-white hover:bg-green-700"
                                >
                                  Реєстрація
                                </NavLink>
                              </>
                            )}

                          </div>

                        </aside>
                      </>
                    )}

                  </header>
                );
              }