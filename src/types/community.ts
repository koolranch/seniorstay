export interface Community {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  imageUrl?: string | null;
  reviewCount?: number;
  description?: string | null;
  zip?: string | null;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  email?: string | null;
  services?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
