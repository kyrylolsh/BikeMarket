export interface Product {
  id: string;

  name: string;
  brand: string;
  category: string;
  description: string;

  price: number;
  image: string;

  sellerId?: string;
  sellerEmail?: string;

  createdAt?: any;
}