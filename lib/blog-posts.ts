export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  fullTitle: string;
  excerpt: string;
  content: string[];
  author: string;
  authorAvatar: string;
  date: string;
  image: string;
  gallery: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'empowering-people-with-disabilities',
    title: 'Empowering People with Disabilities',
    fullTitle:
      'Empowering People with Disabilities: Building an Inclusive and Accessible Society',
    excerpt:
      'People with disabilities are an essential part of our society, yet they often face barriers that limit their full participation in everyday life. True inclusion requires intentional design, supportive policies, and a shift in mindset.',
    content: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.',
      'Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae.',
    ],
    author: 'Arima Inglésina',
    authorAvatar: '/images/images/ariane.jpeg',
    date: '13-09-2026',
    image: '/images/blog-image.png',
    gallery: [
      '/images/images/1.webp',
      '/images/images/2.jpeg',
      '/images/images/3.png',
      '/images/images/5.jpg',
    ],
  },
  {
    id: 2,
    slug: 'how-assistive-devices-improve-life',
    title: 'How Assistive Devices Improve Life',
    fullTitle: 'How Assistive Devices Improve Life and Restore Independence',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.',
    content: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.',
    ],
    author: 'Abdul Karim',
    authorAvatar: '/images/images/abdul.jpeg',
    date: '05-08-2026',
    image: '/images/images/blog-2.jpg',
    gallery: [
      '/images/images/device-1.png',
      '/images/images/device-2.png',
      '/images/images/device-3.png',
      '/images/images/device-5.png',
    ],
  },
  {
    id: 3,
    slug: 'sustainable-mobility-from-e-waste',
    title: 'Sustainable Mobility from E-Waste',
    fullTitle: 'Sustainable Mobility: How Geuza Turns E-Waste into Empowerment',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.',
    content: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
    author: 'Nicole Uwase',
    authorAvatar: '/images/images/nicole.jpeg',
    date: '22-07-2026',
    image: '/images/images/1.webp',
    gallery: [
      '/images/images/device-4.png',
      '/images/images/device-6.png',
      '/images/images/device-7.png',
      '/images/images/device-8.webp',
    ],
  },
  {
    id: 4,
    slug: 'inclusive-design-principles',
    title: 'Inclusive Design Principles',
    fullTitle: 'Inclusive Design Principles Every Engineer Should Know',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.',
    content: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
    author: 'Noel Hakizimana',
    authorAvatar: '/images/images/noel.jpeg',
    date: '14-06-2026',
    image: '/images/images/2.jpeg',
    gallery: [
      '/images/images/1.webp',
      '/images/images/3.png',
      '/images/images/5.jpg',
      '/images/images/devices.jpeg',
    ],
  },
  {
    id: 5,
    slug: 'community-impact-stories',
    title: 'Community Impact Stories',
    fullTitle: 'Community Impact Stories: Lives Changed by Affordable Prosthetics',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.',
    content: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
    author: 'Arima Inglésina',
    authorAvatar: '/images/images/ariane.jpeg',
    date: '30-05-2026',
    image: '/images/images/3.png',
    gallery: [
      '/images/images/device-1.png',
      '/images/images/device-3.png',
      '/images/images/device-5.png',
      '/images/images/device-7.png',
    ],
  },
  {
    id: 6,
    slug: 'recycling-electronics-for-good',
    title: 'Recycling Electronics for Good',
    fullTitle: 'Recycling Electronics for Good: A Circular Economy Approach',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.',
    content: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
    author: 'Toussaint Mugisha',
    authorAvatar: '/images/images/toussaint.jpg',
    date: '10-04-2026',
    image: '/images/images/5.jpg',
    gallery: [
      '/images/images/2.jpeg',
      '/images/images/device-2.png',
      '/images/images/device-4.png',
      '/images/images/device-6.png',
    ],
  },
  {
    id: 7,
    slug: 'future-of-accessible-technology',
    title: 'Future of Accessible Technology',
    fullTitle: 'The Future of Accessible Technology in Sub-Saharan Africa',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.',
    content: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
    author: 'Abdul Karim',
    authorAvatar: '/images/images/abdul.jpeg',
    date: '18-02-2026',
    image: '/images/about-image1.jpeg',
    gallery: [
      '/images/images/devices.jpeg',
      '/images/images/device-8.webp',
      '/images/images/1.webp',
      '/images/images/5.jpg',
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getOtherPosts(currentSlug: string, limit = 4): BlogPost[] {
  return blogPosts.filter((p) => p.slug !== currentSlug).slice(0, limit);
}
