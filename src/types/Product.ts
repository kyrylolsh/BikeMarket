export interface Product {
  id: string;

  name: string;
  brand: string;
  category: string;
  description: string;

  price: number;

  // головне фото (для карток)
  image: string;

  // усі фотографії
  images: string[];

  sellerId?: string;
  sellerEmail?: string;

  createdAt?: any;
}