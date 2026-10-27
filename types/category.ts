export interface CategoryImage {
  url: string;
  publicId?: string;
}

export interface ICategory {
  _id: string;
  wpId?: number | null;
  name: string;
  slug: string;
  description: string;
  image: CategoryImage;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ISubCategory {
  _id: string;
  wpId?: number | null;
  name: string;
  slug: string;
  category: string;
  categoryName?: string;
  description: string;
  image: CategoryImage;
  order: number;
  createdAt: string;
  updatedAt: string;
}
