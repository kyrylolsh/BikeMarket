import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import {
  chatService,
  type Message,
  type Chat,
} from "../services/chatService";

export default function Chat() {
  const { id } = useParams();

  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);

  const [text, setText] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    const unsubscribe =
      chatService.listenMessages(id, setMessages);

    async function loadChat() {
      const data = await chatService.getChat(id);

      if (data) {
        setChat(data);
      }
    }

    loadChat();

    return unsubscribe;
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function handleSend() {
    if (!user || !id) return;

    if (!text.trim()) return;

    await chatService.sendMessage(
      id,
      user.uid,
      text
    );

    setText("");
  }

  return (
    <div className="mx-auto flex h-[85vh] max-w-5xl flex-col rounded-2xl bg-white shadow">

      {chat && (
        <div className="border-b bg-gray-50 p-5">

          <div className="flex items-center gap-4">

            <img
              src={chat.productImage}
              alt={chat.productName}
              className="h-24 w-24 rounded-xl object-cover"
            />

            <div className="flex-1">

              <Link
                to={`/product/${chat.productId}`}
                className="text-2xl font-bold hover:text-green-600"
              >
                {chat.productName}
              </Link>

              <p className="mt-2 text-2xl font-bold text-green-600">
                {chat.productPrice?.toLocaleString()} ₴
              </p>

              <p className="mt-2 text-gray-500">
                Продавець: {chat.sellerEmail}
              </p>

            </div>

          </div>

        </div>
      )}

      <div className="flex-1 space-y-3 overflow-y-auto p-5">

        {messages.map((message) => {
          const date = message.createdAt?.toDate?.();

          return (
            <div
              key={message.id}
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                message.senderId === user?.uid
                  ? "ml-auto bg-green-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              <p>{message.text}</p>

              <p
                className={`mt-2 text-right text-xs ${
                  message.senderId === user?.uid
                    ? "text-green-100"
                    : "text-gray-500"
                }`}
              >
                {date
                  ? date.toLocaleTimeString("uk-UA", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </p>
            </div>
          );
        })}

        <div ref={messagesEndRef} />

      </div>

      <div className="flex gap-3 border-t p-5">

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Напишіть повідомлення..."
          className="flex-1 rounded-xl border p-3"
        />

        <button
          onClick={handleSend}
          className="rounded-xl bg-green-600 px-6 text-white transition hover:bg-green-700"
        >
          Надіслати
        </button>

      </div>

    </div>
  );
}