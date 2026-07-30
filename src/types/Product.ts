export interface Product {
  id: string;

  name: string;
  brand: string;

  type: "bike" | "gear";

  category: string;

  description: string;

  price: number;

  image: string;

  condition: "new" | "used";

  images: string[];

  sellerId?: string;

  sellerEmail?: string;

  sellerNickname?: string;

  createdAt?: any;
}