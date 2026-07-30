import { useEffect, useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FiUser,
  FiPackage,
  FiShoppingBag,
  FiMessageCircle,
  FiPlusCircle,
  FiLogOut,
  FiHeart,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";

import { productService } from "../services/productService";
import {
  orderService,
  type Order,
} from "../services/orderService";

import type { Product } from "../types/Product";

export default function Profile() {
  const navigate = useNavigate();

  const {
    user,
    loading,
    logout,
  } = useAuth();

  const { favorites } = useFavorites();

  const [myListings, setMyListings] =
    useState<Product[]>([]);

  const [myOrders, setMyOrders] =
    useState<Order[]>([]);

  const [sellerOrders, setSellerOrders] =
    useState<Order[]>([]);

  useEffect(() => {
    async function loadStats() {
      if (!user) return;

      const listings =
        await productService.getSellerProducts(
          user.uid
        );

      const orders =
        await orderService.getUserOrders(
          user.email!
        );

      const customerOrders =
        await orderService.getSellerOrders(
          user.uid
        );

      setMyListings(listings);
      setMyOrders(orders);
      setSellerOrders(customerOrders);
    }

    loadStats();
  }, [user]);

  if (loading) {
    return (
      <div className="p-10 text-center">
        Завантаження...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  async function handleLogout() {
    try {
      await logout();

      toast.success("Ви успішно вийшли");

      navigate("/");
    } catch {
      toast.error("Помилка виходу");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-10 rounded-3xl bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 p-8 text-white shadow-2xl">

            <div className="flex flex-col items-center gap-6 md:flex-row">

              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-5xl">
                <FiUser />
              </div>

              <div className="flex-1">

                <h1 className="text-4xl font-bold">
                  Особистий кабінет
                </h1>

                <p className="mt-2 text-lg opacity-90">
                  {user.email}
                </p>

                <p className="mt-1 text-sm opacity-80">
                  ID: {user.uid}
                </p>

              </div>

            </div>

          </div>

          <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl">
              <FiPackage
                size={34}
                className="text-green-600"
              />

              <h2 className="mt-4 text-lg font-bold">
                Оголошення
              </h2>

              <p className="mt-2 text-3xl font-bold">
                {myListings.length}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl">
              <FiShoppingBag
                size={34}
                className="text-blue-600"
              />

              <h2 className="mt-4 text-lg font-bold">
                Покупки
              </h2>

              <p className="mt-2 text-3xl font-bold">
                {myOrders.length}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl">
              <FiHeart
                size={34}
                className="text-red-500"
              />

              <h2 className="mt-4 text-lg font-bold">
                Обране
              </h2>

              <p className="mt-2 text-3xl font-bold">
                {favorites.length}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl">
              <FiShoppingBag
                size={34}
                className="text-orange-500"
              />

              <h2 className="mt-4 text-lg font-bold">
                Продажі
              </h2>

              <p className="mt-2 text-3xl font-bold">
                {sellerOrders.length}
              </p>
            </div>

          </div>
                <div className="grid gap-6 md:grid-cols-2">

                  <Link
                    to="/orders"
                    className="group rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <FiShoppingBag
                      size={34}
                      className="text-green-600"
                    />

                    <h2 className="mt-4 text-2xl font-bold">
                      Мої покупки
                    </h2>

                    <p className="mt-2 text-gray-500">
                      Перегляд усіх оформлених замовлень.
                    </p>
                  </Link>

                  <Link
                    to="/seller-orders"
                    className="group rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <FiPackage
                      size={34}
                      className="text-orange-500"
                    />

                    <h2 className="mt-4 text-2xl font-bold">
                      Замовлення клієнтів
                    </h2>

                    <p className="mt-2 text-gray-500">
                      Усі покупки ваших товарів.
                    </p>
                  </Link>

                  <Link
                    to="/my-listings"
                    className="group rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <FiPackage
                      size={34}
                      className="text-blue-600"
                    />

                    <h2 className="mt-4 text-2xl font-bold">
                      Мої оголошення
                    </h2>

                    <p className="mt-2 text-gray-500">
                      Керуйте своїми товарами.
                    </p>
                  </Link>

                  <Link
                    to="/sell"
                    className="group rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <FiPlusCircle
                      size={34}
                      className="text-emerald-600"
                    />

                    <h2 className="mt-4 text-2xl font-bold">
                      Створити оголошення
                    </h2>

                    <p className="mt-2 text-gray-500">
                      Додайте новий товар до маркетплейсу.
                    </p>
                  </Link>

                  <Link
                    to="/messages"
                    className="group rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl md:col-span-2"
                  >
                    <FiMessageCircle
                      size={34}
                      className="text-indigo-600"
                    />

                    <h2 className="mt-4 text-2xl font-bold">
                      Повідомлення
                    </h2>

                    <p className="mt-2 text-gray-500">
                      Чати з покупцями та продавцями.
                    </p>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-3 rounded-2xl bg-red-500 py-4 text-lg font-bold text-white transition hover:bg-red-600 md:col-span-2"
                  >
                    <FiLogOut size={22} />
                    Вийти з акаунта
                  </button>

                </div>

              </div>
            );
          }