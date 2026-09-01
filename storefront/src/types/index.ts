export type StoreView = "grid" | "rnnr" | "roam";

export type ThemeMode = "dark" | "light";

export interface ProductItem {
  id: string | number;
  handle: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  available: boolean;
  category: string;
  tags: string[];
  images: string[];
  description?: string;
  variants?: {
    id: string | number;
    title: string;
    available: boolean;
  }[];
}

export interface CartItem {
  key: string;
  product: ProductItem;
  variantId: string | number;
  variantTitle: string;
  quantity: number;
  price: number;
}
