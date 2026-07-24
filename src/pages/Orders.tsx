import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import {
  orderService,
  type Order,
} from "../services/orderService";

export default function Orders() {
  const { user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function loadOrders() {
      if (!user?.email) return;

      console.log("EMAIL:", user.email);

      const data = await orderService.getUserOrders(
        user.email
      );

      console.log("ORDERS:", data);

      setOrders(data);
    }

    loadOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold">
          Увійдіть у свій акаунт
        </h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-10 text-4xl font-bold">
        📦 Мої замовлення
      </h1>

      {orders.length === 0 ? (
        <p>У вас ще немає замовлень.</p>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl bg-white p-6 shadow"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  Замовлення
                </h2>

                <span className="rounded-full bg-green-100 px-4 py-2 font-semibold text-green-700">
                  {order.status}
                </span>
              </div>

              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>

                    <span>
                      {(item.price * item.quantity).toLocaleString()} ₴
                    </span>
                  </div>
                ))}
              </div>

              <hr className="my-5" />

              <div className="flex justify-between text-xl font-bold">
                <span>Разом</span>

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