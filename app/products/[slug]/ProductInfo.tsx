"use client";

import { useState } from "react";
import QuantitySelector from "./QuantitySelector";
import AddToCartNotification from "@/components/AddToCartNotification";
import { useCart } from "@/contexts/CartContext";
import EnquireModal from "@/components/EnquireModal";
import BookingModal from "@/components/BookingModal";
import PhoneOrderModal from "@/components/PhoneOrderModal";
import { ChevronDown, Leaf, MessageCircleQuestion, Sparkles, ConciergeBell, Phone } from "lucide-react";
import { CiCircleInfo } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";

interface ProductInfoProps {
  product: {
    id: string;
    sku: string;
    title: string;
    price: number;
    originalPrice?: number;
    salePrice?: number;
    enableSale?: boolean;
    description: string;
    benefits?: string[];
    ingredients?: string;
    howtouse?: string;
    image: string;
    stock: number;
    options?: {
      [key: string]: string[];
    };
    category?: string;
  };
}

// Helper Accordion Component
const AccordionItem = ({
  title,
  icon: Icon,
  children,
  isOpen,
  onToggle
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className="border-t border-neutral-200">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-6 text-left transition-colors hover:text-[#5B3A82]"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-[#5B3A82]" strokeWidth={1.5} />
          <span className="text-base text-neutral-600 font-normal">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="h-4 w-4 text-[#5B3A82]" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-sm leading-relaxed text-neutral-600 font-light">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ProductInfo({ product }: ProductInfoProps) {
  const { addToCart } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    Object.keys(product.options || {}).reduce((acc, key) => {
      acc[key] = product.options![key][0];
      return acc;
    }, {} as Record<string, string>)
  );
  const [quantity, setQuantity] = useState(() => {
    // Initialize quantity to 1, but not more than stock
    return product.stock > 0 ? 1 : 0;
  });

  const [showNotification, setShowNotification] = useState(false);

  // Accordion states
  const [openSection, setOpenSection] = useState<string | null>(null);

  // Modal states
  const [isEnquireModalOpen, setIsEnquireModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isPhoneOrderModalOpen, setIsPhoneOrderModalOpen] = useState(false);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Update quantity if it exceeds stock when stock changes
  const handleQuantityChange = (newQuantity: number) => {
    if (product.stock > 0) {
      const clampedQuantity = Math.min(newQuantity, product.stock);
      setQuantity(clampedQuantity);
    }
  };

  const handleOptionChange = (optionKey: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionKey]: value,
    }));
  };

  const handleAddToCart = () => {
    // Prevent adding to cart if out of stock
    if (product.stock <= 0) {
      return;
    }

    // Ensure quantity doesn't exceed stock
    const finalQuantity = Math.min(quantity, product.stock);

    // Format variant string from selected options
    const variantString = product.options
      ? Object.entries(selectedOptions)
        .map(([key, value]) => value)
        .join(" / ")
      : undefined;

    // Add to cart with full item data
    // Use salePrice if sale is enabled, otherwise use regular price
    const cartPrice = product.enableSale && product.salePrice
      ? product.salePrice
      : product.price;

    addToCart(
      {
        id: product.id,
        name: product.title,
        price: cartPrice,
        image: product.image,
        variant: variantString,
      },
      finalQuantity
    );

    // Show notification (replace if already showing)
    setShowNotification(false);
    setTimeout(() => {
      setShowNotification(true);
    }, 100);
  };

  return (
    <>
      {/* Enquire Modal */}
      <EnquireModal
        isOpen={isEnquireModalOpen}
        onClose={() => setIsEnquireModalOpen(false)}
        product={{
          title: product.title,
          image: product.image,
          sku: product.sku,
          material: product.category || "",
        }}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        product={{
          title: product.title,
          image: product.image,
          sku: product.sku,
          category: product.category || "",
        }}
      />

      {/* Phone Order Modal */}
      <PhoneOrderModal
        isOpen={isPhoneOrderModalOpen}
        onClose={() => setIsPhoneOrderModalOpen(false)}
        product={{
          title: product.title,
          image: product.image,
          sku: product.sku,
          category: product.category || "",
        }}
      />

      {/* Notification */}
      {showNotification && (
        <AddToCartNotification
          product={{
            name: product.title,
            price: product.enableSale && product.salePrice ? product.salePrice : product.price,
            image: product.image,
            options: selectedOptions,
          }}
          onClose={() => setShowNotification(false)}
        />
      )}

      <div className="flex flex-col">

        {/* Title - Refined for Professional Look */}
        <h1 className="mb-4 font-serif text-3xl md:text-4xl font-normal tracking-normal text-[#5B3A82] leading-tight">
          {product.title}
        </h1>

        {/* Price - Standard Gray/Purple */}
        {/* <div className="mb-8">
          {product.enableSale && product.salePrice ? (
            <div className="flex items-center gap-3">
              <p className="text-xl font-light text-neutral-400 line-through">
                ${product.originalPrice?.toLocaleString()}
              </p>
              <p className="text-2xl font-light text-[#5B3A82]">
                ${product.salePrice.toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="text-2xl font-light text-[#5B3A82]">
              ${product.price.toFixed(2)}
            </p>
          )}
        </div> */}

        {/* Divider */}
        <div className="mb-8 h-px w-full bg-neutral-200" />

        {/* Description */}
        <div className="mb-8">
          <p className="text-[15px] leading-relaxed text-neutral-600 font-light">
            {product.description}
          </p>
        </div>

        {/* Divider */}
        <div className="mb-8 h-px w-full bg-neutral-200" />

        {/* Action Links */}
        <div className="mb-8 space-y-5">
          <button
            onClick={() => setIsEnquireModalOpen(true)}
            className="flex items-center gap-4 text-[13px] font-light uppercase tracking-[0.15em] text-[#5B3A82] hover:opacity-70 transition-opacity group"
            style={{ fontFamily: 'var(--font-libre-franklin)' }}
          >
            <CiCircleInfo className="h-[22px] w-[22px] text-[#5B3A82]" strokeWidth={0.5} />
            <span>Enquire</span>
          </button>

          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="flex items-center gap-4 text-[13px] font-light uppercase tracking-[0.15em] text-[#5B3A82] hover:opacity-70 transition-opacity group"
            style={{ fontFamily: 'var(--font-libre-franklin)' }}
          >
            <ConciergeBell className="h-[20px] w-[20px] text-[#5B3A82]" strokeWidth={1.5} />
            <span>Appointment Booking</span>
          </button>

          <button
            onClick={() => setIsPhoneOrderModalOpen(true)}
            className="flex items-center gap-4 text-[13px] font-light uppercase tracking-[0.15em] text-[#5B3A82] hover:opacity-70 transition-opacity group"
            style={{ fontFamily: 'var(--font-libre-franklin)' }}
          >
            <Phone className="h-[20px] w-[20px] text-[#5B3A82]" strokeWidth={1.5} />
            <span>Order by Phone</span>
          </button>
        </div>

        {/* Accordions */}
        <div className="mb-8 border-b border-neutral-200">
          {product.ingredients && (
            <AccordionItem
              title="Ingredients"
              icon={Leaf}
              isOpen={openSection === "ingredients"}
              onToggle={() => toggleSection("ingredients")}
            >
              <p>{product.ingredients}</p>
            </AccordionItem>
          )}

          {product.benefits && product.benefits.length > 0 && (
            <AccordionItem
              title="Benefits"
              icon={Sparkles}
              isOpen={openSection === "benefits"}
              onToggle={() => toggleSection("benefits")}
            >
              <ul className="list-disc pl-5 space-y-1">
                {product.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </AccordionItem>
          )}

          {product.howtouse && (
            <AccordionItem
              title="How To Use"
              icon={MessageCircleQuestion}
              isOpen={openSection === "howtouse"}
              onToggle={() => toggleSection("howtouse")}
            >
              <p>{product.howtouse}</p>
            </AccordionItem>
          )}
        </div>

        {/* Options (if any) */}
        {product.options && Object.keys(product.options).length > 0 && (
          <div className="mb-8 space-y-6">
            {Object.entries(product.options).map(([optionKey, values]) => (
              <div key={optionKey}>
                <label className="mb-3 block text-sm font-light uppercase tracking-wide text-neutral-700">
                  {optionKey.charAt(0).toUpperCase() + optionKey.slice(1)}
                </label>
                <div className="flex flex-wrap gap-3">
                  {values.map((value) => (
                    <button
                      key={value}
                      onClick={() => handleOptionChange(optionKey, value)}
                      className={`px-4 py-2 text-sm font-light transition-all focus:outline-none focus:ring-1 focus:ring-[#5B3A82] ${selectedOptions[optionKey] === value
                        ? "bg-[#5B3A82] text-white"
                        : "border border-neutral-200 bg-white text-neutral-600 hover:border-[#5B3A82]"
                        }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Out of Stock Message */}
        {product.stock <= 0 && (
          <div className="mb-8">
            <p className="text-lg font-medium text-[#5B3A82]">
              Out of Stock
            </p>
          </div>
        )}

        {/* Actions Row */}
        {/* {product.stock > 0 && (
          <div className="flex items-center gap-4">
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
              maxStock={product.stock}
            />

            <button
              onClick={handleAddToCart}
              className="flex-1 rounded-full bg-[#5B3A82] h-[52px] px-8 text-[15px] font-medium text-white shadow-sm transition-all hover:bg-[#4a2e6b] hover:shadow active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add to cart
            </button>
          </div>
        )} */}
      </div>
    </>
  );
}
