export interface Product {
  id: number;
  charityImageSrc: string;
  charityImageAlt?: string;
  productImageSrc: string;
  productImageAlt?: string;
  productBrand?: string;
  productTitle?: string;
  productSize?: string;
  productPrice?: string;
  location?: string;
  category?: string;
  subcategory?: string;
  productCondition?: string;
  status?: 'Draft' | 'Active' | 'Removed'; // Refined status types
  stock?: number;
  averageDeliveryTime?: number;
  isLoggedIn?: boolean;
  onFavoriteClick?: () => void;
  onDeleteConfirm?: (productId: number) => void; // Adjusted for ID type consistency
  isFavorite?: boolean;
}
