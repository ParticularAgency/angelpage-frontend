import { Product } from "@/types/productTypes";

export const productData: Product[] = [
	{
		id: 1,
		charityImageSrc: "/images/icons/charity-img.png",
		charityImageAlt: "The Salvation Army Logo",
		productImageSrc: "/images/products/product1.png",
		productImageAlt: "Hollister Crew Neck Jumper",
		productBrand: "Hollister",
		productTitle: "Crew Neck Jumper",
		productSize: "12 UK",
		productPrice: "11.50",
		location: "London",
		category: "Clothing",
		subcategory: "Jumpers",
		productCondition: "New",
		status: "Active", // Status can be 'Draft', 'Active', or 'Removed'
		stock: 10, // Number of items available
		averageDeliveryTime: 5, // Average delivery time in days
	},
	{
		id: 2,
		charityImageSrc: "/images/icons/charity-img2.png",
		charityImageAlt: "RSPCA Logo",
		productImageSrc: "/images/products/product2.png",
		productImageAlt: "Jordan Dunks",
		productBrand: "Jordan",
		productTitle: "Jordan Dunks",
		productSize: "10 UK",
		productPrice: "40.00",
		location: "London",
		category: "Footwear",
		subcategory: "Sneakers",
		productCondition: "Very Good Condition",
		status: "Draft", // Draft status indicates the product is not publicly available yet
		stock: 5, // Current stock of the product
		averageDeliveryTime: 7, // Average delivery time in days
	},
	{
		id: 3,
		charityImageSrc: "/images/icons/charity-img3.png",
		charityImageAlt: "WaterAid Logo",
		productImageSrc: "/images/products/product3.png",
		productImageAlt: "Addison Ross Fine Bone China Mug",
		productBrand: "Addison Ross",
		productTitle: "Fine Bone China Mug",
		productSize: "N/A",
		productPrice: "3.00",
		location: "London",
		category: "Kitchenware",
		subcategory: "Cups & Mugs",
		productCondition: "Good Condition",
		status: "Active",
		stock: 15,
		averageDeliveryTime: 4, // Average delivery time in days
	},
	{
		id: 4,
		charityImageSrc: "/images/icons/charity-img4.png",
		charityImageAlt: "Decor Logo",
		productImageSrc: "/images/products/product4.png",
		productImageAlt: "Balineum Flora Wall Mirror",
		productBrand: "Balineum",
		productTitle: "Flora Wall Mirror",
		productSize: "100x100",
		productPrice: "15.00",
		location: "London",
		category: "Home Decor",
		subcategory: "Mirrors",
		productCondition: "Fair Condition",
		status: "Removed", // This product has been removed, possibly due to zero stock
		stock: 0, // Out of stock
		averageDeliveryTime: 10, // Average delivery time in days
	},
	// Add more products here with all required fields filled in
	{
		id: 5,
		charityImageSrc: "/images/icons/charity-img.png",
		charityImageAlt: "The Salvation Army Logo",
		productImageSrc: "/images/products/product1.png",
		productImageAlt: "Hollister Crew Neck Jumper",
		productBrand: "Hollister",
		productTitle: "Crew Neck Jumper",
		productSize: "12 UK",
		productPrice: "11.50",
		location: "London",
		category: "Clothing",
		subcategory: "Jumpers",
		productCondition: "New",
		status: "Active",
		stock: 7,
		averageDeliveryTime: 5, // Average delivery time in days
	},
	{
		id: 6,
		charityImageSrc: "/images/icons/charity-img2.png",
		charityImageAlt: "RSPCA Logo",
		productImageSrc: "/images/products/product2.png",
		productImageAlt: "Jordan Dunks",
		productBrand: "Jordan",
		productTitle: "Jordan Dunks",
		productSize: "10 UK",
		productPrice: "40.00",
		location: "London",
		category: "Footwear",
		subcategory: "Sneakers",
		productCondition: "Very Good Condition",
		status: "Draft",
		stock: 8,
		averageDeliveryTime: 7, // Average delivery time in days
	},
	{
		id: 7,
		charityImageSrc: "/images/icons/charity-img3.png",
		charityImageAlt: "WaterAid Logo",
		productImageSrc: "/images/products/product3.png",
		productImageAlt: "Addison Ross Fine Bone China Mug",
		productBrand: "Addison Ross",
		productTitle: "Fine Bone China Mug",
		productSize: "N/A",
		productPrice: "3.00",
		location: "London",
		category: "Kitchenware",
		subcategory: "Cups & Mugs",
		productCondition: "Good Condition",
		status: "Active",
		stock: 20,
		averageDeliveryTime: 4, // Average delivery time in days
	},
	{
		id: 8,
		charityImageSrc: "/images/icons/charity-img4.png",
		charityImageAlt: "Decor Logo",
		productImageSrc: "/images/products/product4.png",
		productImageAlt: "Balineum Flora Wall Mirror",
		productBrand: "Balineum",
		productTitle: "Flora Wall Mirror",
		productSize: "100x100",
		productPrice: "15.00",
		location: "London",
		category: "Home Decor",
		subcategory: "Mirrors",
		productCondition: "Fair Condition",
		status: "Removed",
		stock: 0,
		averageDeliveryTime: 10, // Average delivery time in days
	},
	{
		id: 9,
		charityImageSrc: "/images/icons/charity-img.png",
		charityImageAlt: "The Salvation Army Logo",
		productImageSrc: "/images/products/product1.png",
		productImageAlt: "Hollister Crew Neck Jumper",
		productBrand: "Hollister",
		productTitle: "Crew Neck Jumper",
		productSize: "12 UK",
		productPrice: "11.50",
		location: "London",
		category: "Clothing",
		subcategory: "Jumpers",
		productCondition: "New",
		status: "Active",
		stock: 4,
		averageDeliveryTime: 5, // Average delivery time in days
	},
	{
		id: 10,
		charityImageSrc: "/images/icons/charity-img2.png",
		charityImageAlt: "RSPCA Logo",
		productImageSrc: "/images/products/product2.png",
		productImageAlt: "Jordan Dunks",
		productBrand: "Jordan",
		productTitle: "Jordan Dunks",
		productSize: "10 UK",
		productPrice: "40.00",
		location: "London",
		category: "Footwear",
		subcategory: "Sneakers",
		productCondition: "Very Good Condition",
		status: "Draft",
		stock: 10,
		averageDeliveryTime: 7, // Average delivery time in days
	},
	{
		id: 11,
		charityImageSrc: "/images/icons/charity-img3.png",
		charityImageAlt: "WaterAid Logo",
		productImageSrc: "/images/products/product3.png",
		productImageAlt: "Addison Ross Fine Bone China Mug",
		productBrand: "Addison Ross",
		productTitle: "Fine Bone China Mug",
		productSize: "N/A",
		productPrice: "3.00",
		location: "London",
		category: "Kitchenware",
		subcategory: "Cups & Mugs",
		productCondition: "Good Condition",
		status: "Active",
		stock: 15,
		averageDeliveryTime: 4, // Average delivery time in days
	},
	{
		id: 12,
		charityImageSrc: "/images/icons/charity-img3.png",
		charityImageAlt: "WaterAid Logo",
		productImageSrc: "/images/products/product3.png",
		productImageAlt: "Addison Ross Fine Bone China Mug",
		productBrand: "Addison Ross",
		productTitle: "Fine Bone China Mug",
		productSize: "N/A",
		productPrice: "3.00",
		location: "London",
		category: "Kitchenware",
		subcategory: "Cups & Mugs",
		productCondition: "Good Condition",
		status: "Removed",
		stock: 0,
		averageDeliveryTime: 10, // Average delivery time in days
	},
	{
		id: 13,
		charityImageSrc: "/images/icons/charity-img4.png",
		charityImageAlt: "Decor Logo",
		productImageSrc: "/images/products/product4.png",
		productImageAlt: "Balineum Flora Wall Mirror",
		productBrand: "Balineum",
		productTitle: "Flora Wall Mirror",
		productSize: "100x100",
		productPrice: "15.00",
		location: "London",
		category: "Home Decor",
		subcategory: "Mirrors",
		productCondition: "Fair Condition",
		status: "Active",
		stock: 5,
		averageDeliveryTime: 6, // Average delivery time in days
	},
];
