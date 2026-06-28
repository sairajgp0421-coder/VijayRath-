export interface Review {
  id: string;
  userName: string;
  userInitials: string;
  rating: number;
  timeAgo: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  gujaratiName?: string;
  category: "all" | "farsan" | "sweets" | "dryfruits" | "giftboxes" | "namkeen";
  price: number; // base price (usually per unit selected, e.g. 250g, 500g, 1kg)
  unit: string; // e.g. "250g", "500g", "1 KG"
  availableWeights: string[]; // e.g. ["250g", "500g", "1 KG"]
  imageUrl: string;
  description: string;
  rating: number;
  reviewCount: number;
  stockText: string; // e.g. "150 kg", "5 kg (Low)", "Out of Stock"
  stockLevel: number; // in kg or units
  isLowStock?: boolean;
  isOutOfStock?: boolean;
  isFresh?: boolean;
}

export interface CartItem {
  id: string; // combination of productId and selectedWeight to allow same product in multiple weights
  product: Product;
  selectedWeight: string;
  quantity: number;
  priceForWeight: number;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
}

export interface Order {
  id: string; // e.g. "ORD-9081"
  date: string;
  items: {
    name: string;
    weight: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  status: "Order Confirmed" | "Order Processed" | "Out for Delivery" | "Delivered";
  deliveryAddress: {
    name: string;
    phone: string;
    details: string;
  };
  paymentMethod: string;
  datePlaced: string;
}

export type ViewType = "home" | "product-detail" | "cart" | "checkout" | "tracking" | "account" | "admin" | "terms" | "privacy" | "refund" | "login";
