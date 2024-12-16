export interface Product {
  id: number;
  charity: {
    charityName: string;
    profileImage: string; // Image URL for the charity
  };
  seller: {
    firstName: string;
    lastName: string;
    profileImages: string;
    address?: {
      city?: string;
      country?: string;
    };
  };
  charityImageSrc?: string;
  charityImageAlt?: string;
  productImageSrc?: string;
  images: Array<{ url: string; altText: string }>;
  productImageAlt?: string;
  brand?: string;
  name?: string;
  size?: string;
  dimensionHeight?: string;
  dimensionWidth?: string;
  price?: string;
  location?: string;
  category?: string;
  subcategory?: string;
  condition?: string;
  status?: 'Draft' | 'LIVE' | 'Removed'; // Refined status types
  stock?: number;

  averageDeliveryTime?: number;
  isLoggedIn?: boolean;
  onFavoriteClick?: () => void;
  onDeleteConfirm?: (productId: number) => void; // Adjusted for ID type consistency
  isFavorite?: boolean;
}
export interface CartItem {
  productId: Product;
  quantity: number;
}