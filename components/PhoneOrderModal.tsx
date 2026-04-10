"use client";

import { X, Phone } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import Image from "next/image";

interface PhoneOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: {
        title: string;
        image: string;
        sku: string;
        category?: string;
    };
}

export default function PhoneOrderModal({ isOpen, onClose, product }: PhoneOrderModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-[400px] bg-white shadow-2xl rounded-sm overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600 transition-colors z-10"
                >
                    <X size={24} strokeWidth={1} />
                </button>

                <div className="p-8">
                    {/* Header */}
                    <h2 className="text-center font-serif text-2xl text-[#000000] mb-6">
                        Order by Phone
                    </h2>

                    {/* Product Info */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative w-32 h-32 mb-4">
                            <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <h3 className="text-center font-serif text-lg text-[#000000] leading-tight">
                            {product.title}
                        </h3>
                        {product.category && (
                            <p className="text-xs uppercase tracking-widest text-[#8B7355] mt-2">
                                {product.category}
                            </p>
                        )}
                    </div>

                    <p className="text-center text-neutral-600 font-light mb-8 text-sm">
                        Choose your preferred method to contact us:
                    </p>

                    {/* Actions */}
                    <div className="space-y-4">
                        <a
                            href="tel:+971501916610"
                            className="flex items-center justify-center gap-3 w-full bg-[#000000] text-white py-4 text-[13px] font-serif uppercase tracking-widest hover:bg-[#111111] transition-colors"
                        >
                            <Phone size={18} />
                            <span>Call Now</span>
                        </a>

                        <a
                            href="https://wa.me/971501916610"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full border border-[#25D366] text-[#25D366] py-4 text-[13px] font-serif uppercase tracking-widest hover:bg-[#25D366] hover:text-white transition-all"
                        >
                            <SiWhatsapp size={18} />
                            <span>WhatsApp</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
