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
      setMobileOpen(false);

      toast.success("Ви вийшли з акаунта");
    } catch {
      toast.error("Помилка виходу");
    }
  }
return (
  <>
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">

      <div className="mx-auto flex h-20 max-w-7xl items-center gap-3 px-4 sm:px-6">

        {/* Logo */}

        <Link
          to="/"
          className="shrink-0 text-2xl font-extrabold text-green-600 lg:text-3xl"
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

        <div className="hidden min-w-0 flex-1 md:block">
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

        {/* Правий блок */}

        <div className="ml-auto flex items-center gap-2">

          {/* Favorites */}

          <NavLink
            to="/favorites"
            className="relative hidden md:block rounded-lg p-2 transition hover:bg-gray-100"
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
            className="relative hidden md:block rounded-lg p-2 transition hover:bg-gray-100"
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
                      <div className="relative hidden md:block">

                        <button
                          onClick={() =>
                            setProfileOpen(!profileOpen)
                          }
                          className="flex items-center gap-2 rounded-xl border px-4 py-2 transition hover:bg-gray-50"
                        >
                          <FiUser />

                          <span className="hidden lg:block">
                            Профіль
                          </span>

                          <FiChevronDown
                            className={`transition ${
                              profileOpen
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>

                        {profileOpen && (
                          <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border bg-white shadow-2xl">

                            <div className="border-b px-5 py-4">

                              <p className="font-semibold">
                                {user.email}
                              </p>

                            </div>

                            <Link
                              to="/profile"
                              onClick={() =>
                                setProfileOpen(false)
                              }
                              className="block px-5 py-3 hover:bg-gray-100"
                            >
                              👤 Кабінет
                            </Link>

                            <Link
                              to="/orders"
                              onClick={() =>
                                setProfileOpen(false)
                              }
                              className="block px-5 py-3 hover:bg-gray-100"
                            >
                              📦 Мої замовлення
                            </Link>

                            <Link
                              to="/seller-orders"
                              onClick={() =>
                                setProfileOpen(false)
                              }
                              className="block px-5 py-3 hover:bg-gray-100"
                            >
                              🛒 Замовлення клієнтів
                            </Link>

                            <Link
                              to="/my-listings"
                              onClick={() =>
                                setProfileOpen(false)
                              }
                              className="block px-5 py-3 hover:bg-gray-100"
                            >
                              🚲 Мої оголошення
                            </Link>

                            <button
                              onClick={handleLogout}
                              className="w-full border-t px-5 py-3 text-left text-red-600 transition hover:bg-red-50"
                            >
                              🚪 Вийти
                            </button>

                          </div>
                        )}

                      </div>
                    ) : (
                      <Link
                        to="/register"
                        className="hidden rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 md:block"
                      >
                        Реєстрація
                      </Link>
                    )}

                    {/* Burger */}

                    <button
                      onClick={() =>
                        setMobileOpen(!mobileOpen)
                      }
                      className="rounded-lg p-2 transition hover:bg-gray-100 xl:hidden"
                    >
                      {mobileOpen ? (
                        <FiX size={26} />
                      ) : (
                        <FiMenu size={26} />
                      )}
                    </button>

                  </div>

                </div>
                      {/* Mobile menu */}

                      {mobileOpen && (
                        <div className="border-t bg-white xl:hidden">

                          <div className="flex flex-col gap-4 p-5">

                            {/* Search */}

                            <SearchBar />

                            {/* Navigation */}

                            <NavLink
                              to="/"
                              onClick={() => setMobileOpen(false)}
                              className="rounded-lg px-3 py-2 hover:bg-gray-100"
                            >
                              🏠 Головна
                            </NavLink>

                            <NavLink
                              to="/bikes"
                              onClick={() => setMobileOpen(false)}
                              className="rounded-lg px-3 py-2 hover:bg-gray-100"
                            >
                              🚴 Велосипеди
                            </NavLink>

                            <NavLink
                              to="/bike-parts"
                              onClick={() => setMobileOpen(false)}
                              className="rounded-lg px-3 py-2 hover:bg-gray-100"
                            >
                              🛠 Велозапчастини
                            </NavLink>

                            <NavLink
                              to="/sell"
                              onClick={() => setMobileOpen(false)}
                              className="rounded-lg px-3 py-2 hover:bg-gray-100"
                            >
                              ➕ Продати
                            </NavLink>

                            <NavLink
                              to="/favorites"
                              onClick={() => setMobileOpen(false)}
                              className="rounded-lg px-3 py-2 hover:bg-gray-100"
                            >
                              ❤️ Обране ({favorites.length})
                            </NavLink>

                            <NavLink
                              to="/cart"
                              onClick={() => setMobileOpen(false)}
                              className="rounded-lg px-3 py-2 hover:bg-gray-100"
                            >
                              🛒 Кошик ({cartCount})
                            </NavLink>

                            {user ? (
                              <>
                                <hr />

                                <div className="px-3 text-sm text-gray-500">
                                  {user.email}
                                </div>

                                <NavLink
                                  to="/profile"
                                  onClick={() => setMobileOpen(false)}
                                  className="rounded-lg px-3 py-2 hover:bg-gray-100"
                                >
                                  👤 Кабінет
                                </NavLink>

                                <NavLink
                                  to="/orders"
                                  onClick={() => setMobileOpen(false)}
                                  className="rounded-lg px-3 py-2 hover:bg-gray-100"
                                >
                                  📦 Мої замовлення
                                </NavLink>

                                <NavLink
                                  to="/seller-orders"
                                  onClick={() => setMobileOpen(false)}
                                  className="rounded-lg px-3 py-2 hover:bg-gray-100"
                                >
                                  🛒 Замовлення клієнтів
                                </NavLink>

                                <NavLink
                                  to="/my-listings"
                                  onClick={() => setMobileOpen(false)}
                                  className="rounded-lg px-3 py-2 hover:bg-gray-100"
                                >
                                  🚲 Мої оголошення
                                </NavLink>

                                <button
                                  onClick={handleLogout}
                                  className="rounded-lg border border-red-500 px-3 py-2 text-left text-red-600 hover:bg-red-50"
                                >
                                  🚪 Вийти
                                </button>
                              </>
                            ) : (
                              <NavLink
                                to="/register"
                                onClick={() => setMobileOpen(false)}
                                className="rounded-xl bg-green-600 px-4 py-3 text-center font-semibold text-white"
                              >
                                Реєстрація
                              </NavLink>
                            )}

                          </div>

                        </div>
                      )}

                    </header>
                  </>
                );
                }