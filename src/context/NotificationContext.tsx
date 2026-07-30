import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

import { listenSellerOrders } from "../services/orderListener";
import { listenUserChats } from "../services/chatListener";

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

  const [newOrders, setNewOrders] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);


  useEffect(() => {

    if (!user) {
      setNewOrders(0);
      setUnreadMessages(0);
      return;
    }


    // =====================
    // Замовлення
    // =====================

    const unsubscribeOrders =
      listenSellerOrders(
        user.uid,
        (orders) => {

          const count =
            orders.filter(
              (order) =>
                order.status === "Нове"
            ).length;


          setNewOrders(count);
        }
      );



    // =====================
    // Чати
    // =====================

    const unsubscribeChats =
      listenUserChats(
        user.uid,
        (chats) => {

          let unread = 0;


          chats.forEach((chat) => {


            // якщо користувач покупець
            if (
              chat.buyerId === user.uid
            ) {

              unread += Number(
                chat.buyerUnread || 0
              );

            }


            // якщо користувач продавець
            else if (
              chat.sellerId === user.uid
            ) {

              unread += Number(
                chat.sellerUnread || 0
              );

            }

          });



          console.log(
            "Unread messages:",
            unread
          );


          setUnreadMessages(unread);

        }
      );



    return () => {
      unsubscribeOrders();
      unsubscribeChats();
    };


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