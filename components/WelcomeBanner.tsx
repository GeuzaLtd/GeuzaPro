import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function WelcomeBanner() {
  return (
    <div className="w-full bg-primary border-b border-white/10 px-4 md:px-8 lg:px-16 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-[10px]">G</span>
          </span>
          <span className="text-white/80 text-xs font-medium tracking-wide whitespace-nowrap">
            Welcome to <span className="text-secondary font-semibold">Geuza</span> — Transform Your Experience
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3.5">
          <Link href="https://www.facebook.com/geuzaltd" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/60 hover:text-secondary transition-colors duration-200">
            <FaFacebookF size={12} />
          </Link>
          <Link href="https://x.com/GeuzaLtd" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-white/60 hover:text-secondary transition-colors duration-200">
            <FaXTwitter size={12} />
          </Link>
          <Link href="https://www.instagram.com/geuza_ltd?igsh=N3NwZGppdnBucnNx" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/60 hover:text-secondary transition-colors duration-200">
            <FaInstagram size={12} />
          </Link>
          <Link href="https://www.linkedin.com/company/geuza-africa/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-white/60 hover:text-secondary transition-colors duration-200">
            <FaLinkedinIn size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
