export interface Product {
  id: string;

  name: string;

  brand?: string;

  type:
    | "bike"
    | "gear"
    | "event"
    | "wanted"
    | "exchange";

  category: string;

  wantedCategory?: "bike" | "gear";

  description: string;

  price: number;

  image: string;

  condition?: "new" | "used" | "any";

  images: string[];

  sellerId?: string;

  sellerEmail?: string;

  sellerNickname?: string;

  // ===== EVENT =====

  eventDate?: string;

  eventLocation?: string;

  phone?: string;

  // ===== WANTED =====

  negotiable?: boolean;

  // ===== EXCHANGE =====

  exchangeFor?: string;      // що хоче отримати
  exchangeCategory?: "bike" | "gear";
  exchangePossible?: boolean;

  createdAt?: any;
}