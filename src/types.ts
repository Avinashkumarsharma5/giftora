export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  image: string;
  images: string[];
  rating: number;
  reviewsCount: number;
  stock: number;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  festivalOffer: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  total: number;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  paymentMethod: "cod" | "card" | "upi";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "processing" | "shipped" | "delivered" | "cancelled";
  trackingNumber: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minPurchase: number;
  active: boolean;
}

export interface AIRecommendation {
  giftName: string;
  reason: string;
  priceEstimate: string;
  suggestedCategory: string;
}
