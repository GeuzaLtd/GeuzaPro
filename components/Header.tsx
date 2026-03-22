import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/lib/auth';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';

const navLinks = [
  { name: 'COMPANY',  href: '/company'  },
  { name: 'PRODUCTS', href: '/products' },
  { name: 'SHOP',     href: '/shop'     },
  { name: 'BLOG',     href: '/blog'     },
];

export default async function Header() {
  const session = await auth();
  const user    = session?.user;
  const isLoggedIn = !!user;

  return (
    <header className="bg-white py-4 px-4 md:px-8 lg:px-16 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Geuza Logo"
            width={120}
            height={40}
            className="object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link
                href="/donate"
                className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-all"
              >
                Donate
              </Link>
              <UserMenu
                name={user?.name ?? 'User'}
                email={user?.email ?? ''}
                role={user?.role ?? 'user'}
              />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-6 py-2 border-2 border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition-all"
              >
                Sign in
              </Link>
              <Link
                href="/donate"
                className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-all"
              >
                Donate
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle + menu */}
        <MobileMenu navLinks={navLinks} isLoggedIn={isLoggedIn} />
      </div>
    </header>
  );
}
