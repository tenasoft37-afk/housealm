"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, Phone, Facebook, Instagram } from "lucide-react";
import { SiTiktok, SiWhatsapp } from "react-icons/si";
import SearchOverlay from "./SearchOverlay";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function Navbar() {
  // const { cartCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const lastScrollYRef = useRef(0);
  const pathname = usePathname();
  const isContactPage = pathname === '/contact';
  const isCategoryPage = pathname?.startsWith('/category/');
  const isProductPage = pathname?.startsWith('/products/');
  const isCartPage = pathname === '/cart';
  const isCheckoutPage = pathname === '/checkout';

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 15);

      // Hide navbar on scroll down in products, category, cart, and checkout pages
      // Show only when at the top
      if (isProductPage || isCategoryPage || isCartPage || isCheckoutPage) {
        if (currentScrollY <= 50) {
          // Show navbar when near the top
          setIsNavbarHidden(false);
        } else if (currentScrollY > lastScrollYRef.current) {
          // Hide when scrolling down
          setIsNavbarHidden(true);
        }
        lastScrollYRef.current = currentScrollY;
      } else {
        setIsNavbarHidden(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isProductPage, isCategoryPage, isCartPage, isCheckoutPage]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    // Only apply on mobile screens (width < 768px)
    const isMobile = window.innerWidth < 768;

    if (menuOpen && isMobile) {
      // Save current scroll position
      const scrollY = window.scrollY;
      // Prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scrolling
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [menuOpen]);



  // NOTE: We no longer load or show dynamic categories in the navbar.

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{
        opacity: isNavbarHidden ? 0 : 1,
        y: isNavbarHidden ? -120 : 0
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`border-t-[5px] border-[#5B3A82] sticky top-0 left-0 w-full z-50 transition-all duration-300 bg-white dark:bg-neutral-900 shadow-sm ${isNavbarHidden ? 'pointer-events-none' : ''}`}
    >
      {/* Announcement Bar Removed */}

      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between px-4 py-2 md:px-8 transition-[padding] duration-300 text-neutral-900 dark:text-white`}
      >
        {/* Left: Logo + Name */}
        <Link href="/" className="flex items-center relative">
          {/* Glow effect for dark backgrounds */}
          {/* Glow effect removed as we now have solid background */}
          <Image
            src="/logo1.png"
            alt="House of Almas Logo"
            width={150}
            height={150}
            priority
            sizes="(max-width: 768px) 112px, (max-width: 1024px) 128px, (max-width: 1280px) 160px, 176px"
            className={`h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 xl:h-28 xl:w-28 object-contain transition-all duration-300 relative z-10 cursor-pointer`}
          />
        </Link>

        {/* Right: Search + Menu (Desktop & Mobile combined layout) */}
        <div className="flex items-center gap-6">
          <button
            aria-label="Search"
            className="text-[#5B3A82] hover:opacity-70 transition-opacity"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search size={22} strokeWidth={1.5} />
          </button>

          <div className="h-4 w-[1px] bg-[#5B3A82]/20 mx-1 hidden md:block"></div>

          <button
            className="flex items-center gap-3 text-[#5B3A82] hover:opacity-70 transition-opacity group"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((s) => !s)}
          >
            <span className="hidden md:block text-sm uppercase tracking-widest font-medium">Menu</span>
            <Menu size={26} strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      {/* Hamburger menu - Full-screen on mobile, sidebar on desktop */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop overlay (desktop only) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden md:block fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />

            {/* Menu drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
              className="fixed right-0 top-0 z-[101] h-screen w-full md:w-1/4 bg-[#F7F7F7] shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                {/* Minimal top header */}
                <motion.header
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
                  className="flex items-center justify-between px-4 md:px-6 py-4 md:py-5 border-b border-neutral-200/50 mb-4 md:mb-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Small logo aligned left */}
                  <Link href="/" onClick={() => setMenuOpen(false)}>
                    <Image
                      src="/logo1.png"
                      alt="House of Almas Logo"
                      width={150}
                      height={150}
                      className="h-20 w-20 md:h-24 md:w-24 object-contain"
                    />
                  </Link>

                  {/* Close (X) icon aligned right */}
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-2 text-neutral-700 hover:text-[#5B3A82] transition-colors duration-300 ease-[0.22,0.61,0.36,1]"
                    aria-label="Close menu"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.header>

                {/* Navigation items */}
                <motion.nav
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 0.61, 0.36, 1] }}
                  className="flex-1 px-4 md:px-6 py-4 md:py-8 pb-32"
                  style={{ paddingBottom: 'max(8rem, env(safe-area-inset-bottom, 8rem))' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ul className="space-y-0">
                    {/* Categories */}
                    {categories.map((category, index) => (
                      <motion.li
                        key={category.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.15 + index * 0.05,
                          ease: [0.22, 0.61, 0.36, 1],
                        }}
                        className="border-b border-neutral-200/50"
                      >
                        <Link
                          href={`/category/${category.slug}`}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center justify-between min-h-[48px] py-6 group"
                        >
                          <span className="text-[15px] font-light tracking-[0.28em] uppercase text-neutral-800 group-hover:text-[#5B3A82] transition-colors duration-300 ease-[0.22,0.61,0.36,1] relative inline-block after:absolute after:bottom-[-2px] after:left-0 after:h-[0.5px] after:w-0 after:bg-[#5B3A82] after:transition-all after:duration-300 after:ease-[0.22,0.61,0.36,1] group-hover:after:w-full">
                            {category.name.toUpperCase()}
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4 text-neutral-400 group-hover:text-[#5B3A82] transition-colors duration-300 ease-[0.22,0.61,0.36,1]"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>

                  {/* View Cart Action Bar */}
                  {/* <div className="w-full my-6 border-t border-b border-neutral-200/50">
                    <Link
                      href="/cart"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full bg-[#5B3A82] text-center py-3 font-bold text-white text-[13px] tracking-[0.3em] uppercase hover:opacity-85 transition-opacity duration-300 ease-[0.22,0.61,0.36,1] min-h-[48px] flex items-center justify-center"
                    >
                      VIEW CART
                    </Link>
                  </div> */}

                  <ul className="space-y-0 mt-6">
                    {/* Divider above contact section */}
                    <motion.li
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.15 + categories.length * 0.05,
                        ease: [0.22, 0.61, 0.36, 1],
                      }}
                      className="border-t border-neutral-200/50"
                    />

                    {/* Contact items */}
                    <motion.li
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.2 + categories.length * 0.05,
                        ease: [0.22, 0.61, 0.36, 1],
                      }}
                      className="border-b border-neutral-200/50"
                    >
                      <a
                        href="https://wa.me/971501916610"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 min-h-[48px] py-6 group"
                      >
                        <SiWhatsapp className="h-4 w-4 text-neutral-400 opacity-40 group-hover:opacity-100 group-hover:text-[#5B3A82] transition-all duration-300 ease-[0.22,0.61,0.36,1]" />
                        <span className="text-[13px] font-light tracking-[0.25em] uppercase text-neutral-800 group-hover:text-[#5B3A82] transition-colors duration-300 ease-[0.22,0.61,0.36,1] relative inline-block after:absolute after:bottom-[-2px] after:left-0 after:h-[0.5px] after:w-0 after:bg-[#5B3A82] after:transition-all after:duration-300 after:ease-[0.22,0.61,0.36,1] group-hover:after:w-full">
                          WhatsApp Contact
                        </span>
                      </a>
                    </motion.li>

                    <motion.li
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.25 + categories.length * 0.05,
                        ease: [0.22, 0.61, 0.36, 1],
                      }}
                      className="border-b border-neutral-200/50"
                    >
                      <a
                        href="tel:+971501916610"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 min-h-[48px] py-6 group"
                      >
                        <Phone className="h-4 w-4 text-neutral-400 opacity-40 group-hover:opacity-100 group-hover:text-[#5B3A82] transition-all duration-300 ease-[0.22,0.61,0.36,1]" />
                        <span className="text-[13px] font-light tracking-[0.25em] uppercase text-neutral-800 group-hover:text-[#5B3A82] transition-colors duration-300 ease-[0.22,0.61,0.36,1] relative inline-block after:absolute after:bottom-[-2px] after:left-0 after:h-[0.5px] after:w-0 after:bg-[#5B3A82] after:transition-all after:duration-300 after:ease-[0.22,0.61,0.36,1] group-hover:after:w-full">
                          +971501916610
                        </span>
                      </a>
                    </motion.li>

                    <motion.li
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.3 + categories.length * 0.05,
                        ease: [0.22, 0.61, 0.36, 1],
                      }}
                      className="border-b border-neutral-200/50"
                    >
                      <Link
                        href="https://www.instagram.com/thehouseofalmas/"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 min-h-[48px] py-6 group"
                      >
                        <Instagram className="h-4 w-4 text-neutral-400 opacity-40 group-hover:opacity-100 group-hover:text-[#5B3A82] transition-all duration-300 ease-[0.22,0.61,0.36,1]" />
                        <span className="text-[13px] font-light tracking-[0.25em] uppercase text-neutral-800 group-hover:text-[#5B3A82] transition-colors duration-300 ease-[0.22,0.61,0.36,1] relative inline-block after:absolute after:bottom-[-2px] after:left-0 after:h-[0.5px] after:w-0 after:bg-[#5B3A82] after:transition-all after:duration-300 after:ease-[0.22,0.61,0.36,1] group-hover:after:w-full">
                          Instagram
                        </span>
                      </Link>
                    </motion.li>

                    <motion.li
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.35 + categories.length * 0.05,
                        ease: [0.22, 0.61, 0.36, 1],
                      }}
                      className="border-b border-neutral-200/50 last:border-b-0"
                    >
                      <Link
                        href="https://www.facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 min-h-[48px] py-6 group"
                      >
                        <Facebook className="h-4 w-4 text-neutral-400 opacity-40 group-hover:opacity-100 group-hover:text-[#5B3A82] transition-all duration-300 ease-[0.22,0.61,0.36,1]" />
                        <span className="text-[13px] font-light tracking-[0.25em] uppercase text-neutral-800 group-hover:text-[#5B3A82] transition-colors duration-300 ease-[0.22,0.61,0.36,1] relative inline-block after:absolute after:bottom-[-2px] after:left-0 after:h-[0.5px] after:w-0 after:bg-[#5B3A82] after:transition-all after:duration-300 after:ease-[0.22,0.61,0.36,1] group-hover:after:w-full">
                          Facebook
                        </span>
                      </Link>
                    </motion.li>
                  </ul>
                </motion.nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      {/* <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} /> */}

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </motion.header>
  );
}
