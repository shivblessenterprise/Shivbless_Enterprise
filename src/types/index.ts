export type Marketplace = "meesho" | "flipkart" | "both";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  subCategory: string;
  images: string[];
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  marketplace: Marketplace;
  meeshoUrl?: string;
  flipkartUrl?: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isTrending: boolean;
  stockStatus: StockStatus;
  colours: string[];
  sizes: string[];
  highlights: string[];
  specifications: ProductSpecification[];
  tags: string[];
  createdAt: string;
  badge?: "Bestseller" | "Trending" | "Popular Choice" | "Customer Favourite" | "New";
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  /** PLACEHOLDER: Replace with real customer testimonials */
  isPlaceholder: true;
}

export type SortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "popular";

export interface ProductFilters {
  search: string;
  categories: string[];
  marketplaces: Marketplace[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  stockStatus: StockStatus[];
  sort: SortOption;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  email: string;
  meeshoStoreUrl: string;
  flipkartStoreUrl: string;
  social: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
}
