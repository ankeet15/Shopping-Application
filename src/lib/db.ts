import {
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  MOCK_REVIEWS,
  MOCK_COUPONS,
  MockProduct,
  MockCategory,
  MockReview,
  MockCoupon,
  MockOrder,
} from "./mockData";

export type { MockProduct, MockCategory, MockReview, MockCoupon, MockOrder };
import { useOrderStore } from "@/store/orderStore";

// Safe mock stub for Prisma Client when environment has no running DB adapters
class PrismaClientStub {
  category = { findMany: async () => [] };
  product = { findMany: async () => [], findUnique: async () => null };
  review = { findMany: async () => [], create: async () => null };
  user = { findFirst: async () => null };
  coupon = { findUnique: async () => null };
}

export const prisma = new PrismaClientStub() as any;

// Simple runtime in-memory database fallback to handle dynamically added orders, reviews, addresses, etc.
const dynamicReviews: MockReview[] = [...MOCK_REVIEWS];
const dynamicOrders: any[] = [];
const dynamicCoupons: MockCoupon[] = [...MOCK_COUPONS];
const dynamicProducts: MockProduct[] = [...MOCK_PRODUCTS];
const dynamicAddresses: any[] = [
  {
    id: "addr_default",
    name: "Jane Doe",
    line1: "124 slow Living Lane",
    line2: "Apt 4B",
    city: "Portland",
    state: "Oregon",
    pincode: "97201",
    phone: "503-555-0192",
    isDefault: true,
  },
];
const dynamicWishlist: string[] = [];

// Helper check to determine if Prisma is connected and active
const isDatabaseConnected = (): boolean => {
  return !!process.env.DATABASE_URL && process.env.DATABASE_URL.length > 10;
};

// --- CATEGORIES ---
export async function getCategories(): Promise<MockCategory[]> {
  if (isDatabaseConnected()) {
    try {
      const dbCategories = await prisma.category.findMany();
      if (dbCategories.length > 0) {
        return dbCategories.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          icon: c.icon,
          bgOpacity: "bg-rose-50/70 text-petal-rose", // visual fallback matching structure
        }));
      }
    } catch (e) {
      console.warn("Prisma Category Fetch failed, falling back to mock data.", e);
    }
  }
  return MOCK_CATEGORIES;
}

// --- PRODUCTS ---
export interface ProductFilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  search?: string;
  sort?: string;
  inStock?: boolean;
}

export async function getProducts(options: ProductFilterOptions = {}): Promise<MockProduct[]> {
  let productsList: MockProduct[] = [];

  if (isDatabaseConnected()) {
    try {
      const where: any = {};
      if (options.category && options.category !== "all") {
        where.category = { slug: options.category };
      }
      if (options.minPrice !== undefined || options.maxPrice !== undefined) {
        where.price = {};
        if (options.minPrice !== undefined) where.price.gte = options.minPrice;
        if (options.maxPrice !== undefined) where.price.lte = options.maxPrice;
      }
      if (options.inStock) {
        where.stock = { gt: 0 };
      }
      if (options.search) {
        where.OR = [
          { title: { contains: options.search, mode: "insensitive" } },
          { brand: { contains: options.search, mode: "insensitive" } },
          { description: { contains: options.search, mode: "insensitive" } },
        ];
      }

      let orderBy: any = { createdAt: "desc" };
      if (options.sort) {
        if (options.sort === "price-asc") orderBy = { price: "asc" };
        else if (options.sort === "price-desc") orderBy = { price: "desc" };
        else if (options.sort === "rating-desc") orderBy = { price: "desc" }; // Rating approximations
      }

      const dbProducts = await prisma.product.findMany({
        where,
        orderBy,
        include: { category: true },
      });

      if (dbProducts.length > 0) {
        productsList = dbProducts.map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          brand: (p.variants as any)?.brand || "PETAL Brand",
          description: p.description,
          price: p.price,
          comparePrice: p.comparePrice || undefined,
          images: p.images,
          categoryId: p.categoryId,
          stock: p.stock,
          featured: p.featured,
          variants: (p.variants as any) || { colors: ["#FFFFFF"], sizes: ["Standard"] },
          rating: 4.8, // Fallback placeholder logic
          reviewCount: 15,
        }));
      }
    } catch (e) {
      console.warn("Prisma Product Fetch failed, falling back to mock data.", e);
    }
  }

  // Fallback to local filtering
  if (productsList.length === 0) {
    productsList = [...dynamicProducts];

    if (options.category && options.category !== "all") {
      const cat = MOCK_CATEGORIES.find((c) => c.slug === options.category);
      if (cat) {
        productsList = productsList.filter((p) => p.categoryId === cat.id);
      }
    }

    if (options.minPrice !== undefined) {
      productsList = productsList.filter((p) => p.price >= (options.minPrice ?? 0));
    }
    if (options.maxPrice !== undefined) {
      productsList = productsList.filter((p) => p.price <= (options.maxPrice ?? Infinity));
    }

    if (options.rating) {
      productsList = productsList.filter((p) => p.rating >= (options.rating ?? 0));
    }

    if (options.inStock) {
      productsList = productsList.filter((p) => p.stock > 0);
    }

    if (options.search) {
      const query = options.search.toLowerCase();
      productsList = productsList.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    if (options.sort) {
      if (options.sort === "price-asc") {
        productsList.sort((a, b) => a.price - b.price);
      } else if (options.sort === "price-desc") {
        productsList.sort((a, b) => b.price - a.price);
      } else if (options.sort === "rating-desc") {
        productsList.sort((a, b) => b.rating - a.rating);
      }
    }
  }

  return productsList;
}

export async function getProductBySlug(slug: string): Promise<MockProduct | null> {
  if (isDatabaseConnected()) {
    try {
      const p = await prisma.product.findUnique({
        where: { slug },
      });
      if (p) {
        return {
          id: p.id,
          title: p.title,
          slug: p.slug,
          brand: (p.variants as any)?.brand || "PETAL Brand",
          description: p.description,
          price: p.price,
          comparePrice: p.comparePrice || undefined,
          images: p.images,
          categoryId: p.categoryId,
          stock: p.stock,
          featured: p.featured,
          variants: (p.variants as any) || { colors: ["#FFFFFF"], sizes: ["Standard"] },
          rating: 4.8,
          reviewCount: 15,
        };
      }
    } catch (e) {
      console.warn("Prisma Product details by slug failed.", e);
    }
  }
  return dynamicProducts.find((p) => p.slug === slug) || null;
}

export async function getProductById(id: string): Promise<MockProduct | null> {
  if (isDatabaseConnected()) {
    try {
      const p = await prisma.product.findUnique({
        where: { id },
      });
      if (p) {
        return {
          id: p.id,
          title: p.title,
          slug: p.slug,
          brand: (p.variants as any)?.brand || "PETAL Brand",
          description: p.description,
          price: p.price,
          comparePrice: p.comparePrice || undefined,
          images: p.images,
          categoryId: p.categoryId,
          stock: p.stock,
          featured: p.featured,
          variants: (p.variants as any) || { colors: ["#FFFFFF"], sizes: ["Standard"] },
          rating: 4.8,
          reviewCount: 15,
        };
      }
    } catch (e) {
      console.warn("Prisma Product details by ID failed.", e);
    }
  }
  return dynamicProducts.find((p) => p.id === id) || null;
}

export async function getFeaturedProducts(): Promise<MockProduct[]> {
  const products = await getProducts();
  return products.filter((p) => p.featured);
}

// --- REVIEWS ---
export async function getReviews(productId: string): Promise<MockReview[]> {
  if (isDatabaseConnected()) {
    try {
      const dbReviews = await prisma.review.findMany({
        where: { productId },
        include: { user: true },
        orderBy: { createdAt: "desc" },
      });
      if (dbReviews.length > 0) {
        return dbReviews.map((r: any) => ({
          id: r.id,
          productId: r.productId,
          userName: r.user.name || "Verified Buyer",
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt.toISOString(),
        }));
      }
    } catch (e) {
      console.warn("Prisma Review fetch failed.", e);
    }
  }
  return dynamicReviews.filter((r) => r.productId === productId);
}

export async function addReview(
  productId: string,
  userName: string,
  rating: number,
  comment: string
): Promise<MockReview> {
  if (isDatabaseConnected()) {
    try {
      // Find a generic fallback user or create one for demo purposes
      const user = await prisma.user.findFirst();
      if (user) {
        const r = await prisma.review.create({
          data: {
            productId,
            userId: user.id,
            rating,
            comment,
          },
        });
        return {
          id: r.id,
          productId: r.productId,
          userName: user.name || userName,
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt.toISOString(),
        };
      }
    } catch (e) {
      console.warn("Prisma Review insertion failed.", e);
    }
  }

  const newReview: MockReview = {
    id: Math.random().toString(36).substring(2, 9),
    productId,
    userName,
    rating,
    comment,
    createdAt: new Date().toISOString(),
  };
  dynamicReviews.unshift(newReview);
  return newReview;
}

// --- COUPONS ---
export async function getCoupons(): Promise<MockCoupon[]> {
  return dynamicCoupons;
}

export async function createCoupon(code: string, value: number, type: "PERCENT" | "FIXED"): Promise<MockCoupon> {
  const uppercaseCode = code.toUpperCase();
  const added: MockCoupon = {
    code: uppercaseCode,
    type,
    value,
    minOrder: type === "PERCENT" ? 50 : 20,
  };
  dynamicCoupons.push(added);
  return added;
}

export async function validateCoupon(code: string): Promise<MockCoupon | null> {
  const uppercaseCode = code.toUpperCase();
  if (isDatabaseConnected()) {
    try {
      const c = await prisma.coupon.findUnique({
        where: { code: uppercaseCode },
      });
      if (c && c.expiry > new Date() && (c.usageLimit === null || c.usedCount < c.usageLimit)) {
        return {
          code: c.code,
          type: c.type === "PERCENT" ? "PERCENT" : "FIXED",
          value: c.value,
          minOrder: c.minOrder,
        };
      }
    } catch (e) {
      console.warn("Prisma Coupon validation failed.", e);
    }
  }
  return dynamicCoupons.find((c) => c.code === uppercaseCode) || null;
}

// --- ORDERS ---
export async function createOrder(orderData: any): Promise<any> {
  const newOrder = {
    id: `ord_${Math.random().toString(36).substring(2, 9)}`,
    ...orderData,
    status: "PROCESSING",
    createdAt: new Date().toISOString(),
  };
  dynamicOrders.unshift(newOrder);
  
  // Sync to reactive store in client environment
  if (typeof window !== "undefined") {
    useOrderStore.getState().addOrder(newOrder);
  }
  return newOrder;
}

export async function getOrders(userId?: string): Promise<any[]> {
  if (typeof window !== "undefined") {
    const storeOrders = useOrderStore.getState().orders;
    if (storeOrders.length > 0) {
      return userId ? storeOrders.filter((o) => o.userId === userId) : storeOrders;
    }
  }
  return dynamicOrders;
}

// --- ADDRESSES ---
export async function getAddresses(userId?: string): Promise<any[]> {
  return dynamicAddresses;
}

export async function addAddress(address: any): Promise<any> {
  const newAddr = {
    id: `addr_${Math.random().toString(36).substring(2, 9)}`,
    ...address,
    isDefault: dynamicAddresses.length === 0,
  };
  dynamicAddresses.push(newAddr);
  return newAddr;
}

// --- WISHLIST ---
export async function getWishlist(userId?: string): Promise<string[]> {
  return dynamicWishlist;
}

export async function toggleWishlist(productId: string, userId?: string): Promise<boolean> {
  const index = dynamicWishlist.indexOf(productId);
  if (index >= 0) {
    dynamicWishlist.splice(index, 1);
    return false; // removed
  } else {
    dynamicWishlist.push(productId);
    return true; // added
  }
}

// --- ADMIN CONTROL ACTIONS ---
export async function updateOrderStatus(orderId: string, status: string): Promise<any> {
  const order = dynamicOrders.find((o) => o.id === orderId);
  if (order) {
    order.status = status.toUpperCase();
  }
  if (typeof window !== "undefined") {
    useOrderStore.getState().updateStatus(orderId, status);
  }
  if (order) {
    return order;
  }
  throw new Error("Order not found");
}

export async function addMockProduct(productData: any): Promise<MockProduct> {
  const added: MockProduct = {
    id: `prod_${Math.random().toString(36).substring(2, 9)}`,
    title: productData.title,
    slug: productData.slug,
    brand: productData.brand,
    description: productData.description,
    price: productData.price,
    comparePrice: productData.comparePrice,
    images: productData.images,
    categoryId: productData.categoryId || "cat_1",
    stock: productData.stock,
    featured: true,
    variants: productData.variants || { colors: ["#78716C"], sizes: ["Standard"] },
    rating: 5.0,
    reviewCount: 0,
  };
  dynamicProducts.unshift(added);
  return added;
}
