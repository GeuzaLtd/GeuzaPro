export type ShopFilter = 'All Products' | 'Popular' | 'Best Seller';

export interface ShopProduct {
  id: number;
  name: string;
  price: string;
  inStock: boolean;
  image: string;
  popular?: boolean;
  bestSeller?: boolean;
}

export const SHOP_FILTERS: ShopFilter[] = ['All Products', 'Popular', 'Best Seller'];

export const shopProducts: ShopProduct[] = [
  {
    id: 1,
    name: 'Standard Wheelchair',
    price: '45,000 Frw',
    inStock: true,
    image: '/images/products/wheelchair.png',
    popular: true,
  },
  {
    id: 2,
    name: 'Advanced Wheelchair',
    price: '85,000 Frw',
    inStock: true,
    image: '/images/images/device-2.png',
    bestSeller: true,
  },
  {
    id: 3,
    name: 'Pediatric Wheelchair',
    price: '55,000 Frw',
    inStock: true,
    image: '/images/images/device-4.png',
  },
  {
    id: 4,
    name: 'Sports Wheelchair',
    price: '95,000 Frw',
    inStock: true,
    image: '/images/images/device-8.webp',
    popular: true,
  },
  {
    id: 5,
    name: 'Walking Crutches',
    price: '25,000 Frw',
    inStock: true,
    image: '/images/products/crutches.png',
    popular: true,
    bestSeller: true,
  },
  {
    id: 6,
    name: 'Axillary Crutches',
    price: '20,000 Frw',
    inStock: true,
    image: '/images/images/device-1.png',
  },
  {
    id: 7,
    name: 'Elbow Crutches',
    price: '22,000 Frw',
    inStock: true,
    image: '/images/images/device-5.png',
    popular: true,
  },
  {
    id: 8,
    name: 'Underarm Crutches',
    price: '18,000 Frw',
    inStock: true,
    image: '/images/products/underarm-crutches.png',
    bestSeller: true,
  },
  {
    id: 9,
    name: 'Rollator Walker',
    price: '38,000 Frw',
    inStock: true,
    image: '/images/products/walking-frame.png',
    bestSeller: true,
  },
  {
    id: 10,
    name: 'Quad Cane',
    price: '18,000 Frw',
    inStock: true,
    image: '/images/images/device-6.png',
    popular: true,
  },
  {
    id: 11,
    name: 'Heavy-Duty Walker',
    price: '42,000 Frw',
    inStock: false,
    image: '/images/products/walking-frame.png',
  },
  {
    id: 12,
    name: 'Leg Prosthetic',
    price: '120,000 Frw',
    inStock: true,
    image: '/images/images/device-3.png',
    bestSeller: true,
  },
  {
    id: 13,
    name: 'Advanced Prosthetic',
    price: '150,000 Frw',
    inStock: false,
    image: '/images/images/device-7.png',
    popular: true,
  },
  {
    id: 14,
    name: 'Forearm Prosthetic',
    price: '130,000 Frw',
    inStock: true,
    image: '/images/images/device-3.png',
  },
  {
    id: 15,
    name: 'Carbon Fibre Foot',
    price: '110,000 Frw',
    inStock: true,
    image: '/images/images/device-7.png',
    bestSeller: true,
  },
  {
    id: 16,
    name: 'Tripod Walking Stick',
    price: '15,000 Frw',
    inStock: true,
    image: '/images/images/device-6.png',
  },
];
