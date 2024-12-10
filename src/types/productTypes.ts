export interface Product {
  id: number;
  charityImageSrc: string | null | undefined;
  charityImageAlt?: string;
  productImageSrc: string | null | undefined;
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
  onDeleteConfirm?: (productId: number) => void; // Adjusted for ID type consistency
  isFavorite?: boolean;
}
