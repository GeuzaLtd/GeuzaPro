export type Category = 'All' | 'Wheelchairs' | 'Crutches' | 'Walking Aids' | 'Prosthetics';

export interface Product {
  id: number;
  name: string;
  category: Exclude<Category, 'All'>;
  price: string;
  inStock: boolean;
  image: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  'All',
  'Wheelchairs',
  'Crutches',
  'Walking Aids',
  'Prosthetics',
];

export const products: Product[] = [
  {
    id: 1,
    name: 'Standard Wheelchair',
    category: 'Wheelchairs',
    price: '45,000 Frw',
    inStock: true,
    image: '/images/products/wheelchair.png',
    description:
      'Lightweight and durable manual wheelchair designed for everyday mobility. Foldable frame for easy transport and storage.',
  },
  {
    id: 2,
    name: 'Advanced Wheelchair',
    category: 'Wheelchairs',
    price: '85,000 Frw',
    inStock: true,
    image: '/images/images/device-2.png',
    description:
      'Heavy-duty wheelchair with reinforced steel frame, ergonomic armrests, and anti-tip rear stabilisers for enhanced safety.',
  },
  {
    id: 3,
    name: 'Walking Crutches',
    category: 'Crutches',
    price: '25,000 Frw',
    inStock: true,
    image: '/images/products/crutches.png',
    description:
      'Adjustable aluminium walking crutches with comfortable underarm pads. Suitable for post-surgery recovery and mobility support.',
  },
  {
    id: 4,
    name: 'Axillary Crutches',
    category: 'Crutches',
    price: '20,000 Frw',
    inStock: true,
    image: '/images/images/device-1.png',
    description:
      'Precision-engineered axillary crutches with non-slip rubber tips and padded underarm supports for long-term comfort.',
  },
  {
    id: 5,
    name: 'Elbow Crutches',
    category: 'Crutches',
    price: '22,000 Frw',
    inStock: true,
    image: '/images/images/device-5.png',
    description:
      'Forearm crutches with ergonomic elbow cuffs and contoured hand grips. Ideal for users requiring ongoing mobility assistance.',
  },
  {
    id: 6,
    name: 'Rollator Walker',
    category: 'Walking Aids',
    price: '38,000 Frw',
    inStock: true,
    image: '/images/products/walking-frame.png',
    description:
      'Robust folding rollator walker with adjustable height, four rubber-tipped legs, and a built-in carry bag.',
  },
  {
    id: 7,
    name: 'Quad Cane',
    category: 'Walking Aids',
    price: '18,000 Frw',
    inStock: true,
    image: '/images/images/device-6.png',
    description:
      'Four-point base walking cane providing superior stability over standard single-tip canes. Height-adjustable handle.',
  },
  {
    id: 8,
    name: 'Leg Prosthetic',
    category: 'Prosthetics',
    price: '120,000 Frw',
    inStock: true,
    image: '/images/images/device-3.png',
    description:
      'Below-knee prosthetic with a carbon-fibre reinforced socket and dynamic-response foot for natural walking gait.',
  },
  {
    id: 9,
    name: 'Advanced Prosthetic',
    category: 'Prosthetics',
    price: '150,000 Frw',
    inStock: false,
    image: '/images/images/device-7.png',
    description:
      'Modular above-knee prosthetic system featuring a hydraulic knee joint, adjustable pylon, and SACH foot attachment.',
  },
];
