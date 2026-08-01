export interface Product {
  id: string;

  name: string;

  brand: string;

  type: "bike" | "gear" | "event";

  category: string;

  description: string;

  price: number;

  image: string;

  condition?: "new" | "used";

  images: string[];

  sellerId?: string;

  sellerEmail?: string;

  sellerNickname?: string;


  // ===== EVENT =====

  eventDate?: string;

  eventLocation?: string;

  phone?: string;


  createdAt?: any;
}