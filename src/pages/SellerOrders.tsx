import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import {
  orderService,
  type Order,
} from "../services/orderService";

import { listenSellerOrders } from "../services/orderListener";

export default function SellerOrders() {
  const { user, loading } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = listenSellerOrders(
      user.uid,
      (orders) => {
        setOrders(orders);
      }
    );

    return unsubscribe;
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

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-10 text-4xl font-bold">
        📦 Замовлення клієнтів
      </h1>

      {orders.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 shadow">
          У вас поки немає замовлень.
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl bg-white p-8 shadow"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {order.status === "Нове"
                    ? "🆕 Нове замовлення"
                    : "📦 Замовлення"}
                </h2>

                <span className="rounded-full bg-green-100 px-4 py-2 font-semibold text-green-700">
                  {order.status}
                </span>
              </div>

              <div className="space-y-2">
                <p>
                  <b>👤 Покупець:</b> {order.name}
                </p>

                <p>
                  <b>📞 Телефон:</b> {order.phone}
                </p>

                <p>
                  <b>📧 Email:</b> {order.email}
                </p>

                <p>
                  <b>📍 Адреса:</b> {order.address}
                </p>

                <p>
                  <b>💳 Оплата:</b>{" "}
                  {order.payment === "card"
                    ? "Банківська картка"
                    : "Оплата при отриманні"}
                </p>
              </div>

              <hr className="my-6" />

              <h3 className="mb-4 text-xl font-bold">
                Товари
              </h3>

              <div className="space-y-4">
                {order.items
                  .filter(
                    (item) =>
                      item.sellerId === user.uid
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl bg-gray-100 p-4"
                    >
                      <div>
                        <p className="font-bold">
                          {item.name}
                        </p>

                        <p>{item.quantity} шт.</p>
                      </div>

                      <div className="font-bold text-green-600">
                        {(
                          item.price * item.quantity
                        ).toLocaleString()}{" "}
                        ₴
                      </div>
                    </div>
                  ))}
              </div>

              <hr className="my-6" />

              <div className="flex justify-between text-2xl font-bold">
                <span>Сума замовлення</span>

                <span>
                  {order.total.toLocaleString()} ₴
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}