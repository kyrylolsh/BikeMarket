import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";

import { useAuth } from "./AuthContext";

interface NotificationContextType {
  newOrders: number;
  unreadMessages: number;
}

const NotificationContext =
  createContext<NotificationContextType | undefined>(
    undefined
  );

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  const [newOrders, setNewOrders] =
    useState(0);

  const [unreadMessages, setUnreadMessages] =
    useState(0);

  useEffect(() => {
    if (!user) {
      setNewOrders(0);
      setUnreadMessages(0);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        const orders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as any[];

        const sellerOrders = orders.filter((order) =>
          order.items?.some(
            (item: any) => item.sellerId === user.uid
          )
        );

        setNewOrders(
          sellerOrders.filter(
            (order) => order.status === "Нове"
          ).length
        );

        // Поки що чат ще не реалізований
        setUnreadMessages(0);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{
        newOrders,
        unreadMessages,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context =
    useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }

  return context;
}