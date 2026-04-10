"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
    id: string;
    name: string;
    slug: string;
    image: string;
    categories: string[];
}

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        } else {
            setQuery("");
            setResults([]);
        }
    }, [isOpen]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length > 1) {
                setLoading(true);
                try {
                    const response = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
                    if (response.ok) {
                        const data = await response.json();
                        setResults(data);
                    }
                } catch (error) {
                    console.error("Search failed:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Close on escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] bg-white flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                        <div className="flex items-center gap-4 flex-1">
                            <Search className="text-neutral-400 w-6 h-6" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search products..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full text-xl font-light outline-none placeholder:text-neutral-300 text-neutral-900 bg-transparent h-12"
                            />
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 -mr-2 text-neutral-400 hover:text-neutral-900 transition-colors"
                        >
                            <X size={28} strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Results Area */}
                    <div className="flex-1 overflow-y-auto px-6 py-8">
                        <div className="max-w-3xl mx-auto">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <div className="w-6 h-6 border-2 border-[#000000] border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : results.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6">
                                    {results.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/products/${product.slug}`}
                                            onClick={onClose}
                                            className="flex items-center gap-6 group py-4 border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors -mx-4 px-4 rounded-lg"
                                        >
                                            <div className="relative w-20 h-20 bg-neutral-100 rounded-md overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-neutral-900 group-hover:text-[#000000] transition-colors">
                                                    {product.name}
                                                </h3>
                                                {product.categories && product.categories.length > 0 && (
                                                    <p className="text-sm text-neutral-500 mt-1 uppercase tracking-wide">
                                                        {typeof product.categories[0] === 'string' ? product.categories[0] : (product.categories[0] as any).title || ''}
                                                    </p>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : query.length > 1 ? (
                                <div className="text-center py-20 text-neutral-400">
                                    No products found matching "{query}"
                                </div>
                            ) : null}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
