"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const defaultTitle = "House of Almas logo.";
const defaultImage = "/logo1.png";
const defaultDescription =
    "Welcome to House of Almas";

export default function AboutUs() {
    const [title, setTitle] = useState(defaultTitle);
    const [image, setImage] = useState(defaultImage);
    const [description, setDescription] = useState(defaultDescription);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAboutUs = async () => {
            try {
                const res = await fetch("/api/aboutus");
                if (res.ok) {
                    const data = await res.json();
                    setTitle(data.title || defaultTitle);
                    setImage(data.image || "");
                    setDescription(data.description || defaultDescription);
                }
            } catch (error) {
                console.error("Failed to fetch AboutUs data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAboutUs();
    }, []);

    if (loading) return null;

    return (
        <section id="about-us" className="py-20 md:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
                <div className={`grid grid-cols-1 ${image ? 'lg:grid-cols-2' : ''} gap-16 lg:gap-24 items-center`}>
                    {/* Left: Image (Only show if image exists) */}
                    {image && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            viewport={{ once: true, margin: "-50px" }}
                            className="relative h-[500px] md:h-[650px] w-full bg-neutral-100"
                        >
                            <Image
                                src={image}
                                alt="About House of Almas"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </motion.div>
                    )}

                    {/* Right: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        viewport={{ once: true, margin: "-50px" }}
                        className={`flex flex-col justify-center ${!image ? 'max-w-4xl mx-auto text-left md:text-center' : ''}`}
                    >
                        <span className="text-[#5B3A82] text-sm font-medium tracking-[0.2em] uppercase mb-4 block">
                            Our Story
                        </span>

                        <h2 className="text-4xl md:text-5xl font-playfair text-neutral-900 mb-8 leading-tight">
                            {title}
                        </h2>

                        <div className="space-y-6 text-neutral-600 text-lg leading-relaxed font-light font-inter">
                            {description.split("\n\n").map((paragraph, idx) => (
                                <p key={idx}>
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        <div className={`mt-10 ${!image ? 'flex flex-col items-center' : ''}`}>
                            <div className="h-px w-24 bg-[#5B3A82]/30 mb-6"></div>
                            <p className="font-playfair italic text-xl text-neutral-800">
                                House of Almas Team
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
