import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import {
  chatService,
  type Chat,
} from "../services/chatService";

export default function Messages() {
  const { user, loading } = useAuth();

  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    async function loadChats() {
      if (!user) return;

      const buyerChats =
        await chatService.getBuyerChats(user.uid);

      const sellerChats =
        await chatService.getSellerChats(user.uid);

      const all = [...buyerChats, ...sellerChats];

      const unique = all.filter(
        (chat, index, self) =>
          index ===
          self.findIndex((c) => c.id === chat.id)
      );

      unique.sort((a, b) => {
        if (!a.updatedAt || !b.updatedAt) return 0;

        return (
          b.updatedAt.seconds -
          a.updatedAt.seconds
        );
      });

      setChats(unique);
    }

    loadChats();
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

  async function handleDelete(chatId: string) {
    const ok = window.confirm(
      "Видалити цей чат?"
    );

    if (!ok) return;

    try {
      await chatService.deleteChat(chatId);

      setChats((prev) =>
        prev.filter((chat) => chat.id !== chatId)
      );

      toast.success("Чат видалено");
    } catch {
      toast.error("Не вдалося видалити чат");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">

      <h1 className="mb-8 text-4xl font-bold">
        💬 Мої повідомлення
      </h1>

      {chats.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow">
          У вас поки немає чатів.
        </div>
      ) : (
        <div className="space-y-4">

          {chats.map((chat) => (
            <Link
              key={chat.id}
              to={`/chat/${chat.id}`}
              className="block rounded-2xl bg-white p-6 shadow transition hover:shadow-xl"
            >
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <img
                    src={chat.productImage}
                    alt={chat.productName}
                    className="h-20 w-20 rounded-xl object-cover"
                  />

                  <div>

                    <h2 className="text-lg font-bold">
                      {chat.productName}
                    </h2>

                    <p className="font-bold text-green-600">
                      {chat.productPrice?.toLocaleString()} ₴
                    </p>

                    <p className="text-gray-500">
                      {chat.buyerId === user.uid
                        ? chat.sellerEmail
                        : chat.buyerEmail}
                    </p>

                  </div>

                </div>

                <div className="flex flex-col items-end gap-3">

                  <p className="max-w-xs truncate text-gray-700">
                    {chat.lastMessage || "Без повідомлень"}
                  </p>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(chat.id);
                    }}
                    className="rounded-lg bg-red-500 px-3 py-1 text-sm text-white transition hover:bg-red-600"
                  >
                    🗑 Видалити
                  </button>

                </div>

              </div>

            </Link>
          ))}

        </div>
      )}

    </div>
  );
}