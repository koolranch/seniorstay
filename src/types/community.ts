export interface Community {
  id: number;
  slug: string;
  name: string;
  city: string;
  state: string;
  type: string;
  image: string;
  rating: number;
  reviewCount?: number;
  distance?: string;
  amenities?: string[];
  price?: number;
  lat?: number;
  lng?: number;
  isFeatured?: boolean;
}
