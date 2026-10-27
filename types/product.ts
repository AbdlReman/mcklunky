export interface ColorVariant {
  color: string;
  images: string[];
}

export interface ProductImage {
  url: string;
  publicId?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface IProduct {
  _id: string;
  wpId?: number | null;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  /** Display name of category */
  category: string;
  categoryId: string;
  /** Display name of subcategory */
  subCategory: string | null;
  subCategoryId: string | null;
  /** Effective selling price (GBP) */
  price: number;
  regularPrice: number;
  salePrice: number | null;
  onSale: boolean;
  currency: string;
  tags: string[];
  /** Flat image URLs for UI */
  images: string[];
  imageObjects: ProductImage[];
  inStock: boolean;
  status: "publish" | "draft";
  order: number;
  createdAt: string;
  updatedAt: string;

  /** UI compatibility fields used by existing shop components */
  brand: string;
  categories: string[];
  discount: number;
  detail: string;
  sizes: string[];
  colors: string[];
  colorVariants: ColorVariant[];
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  popularityScore: number;
  soldCount: number;
  metaTitle: string;
  metaDescription: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
  stockQuantity?: number;
}
