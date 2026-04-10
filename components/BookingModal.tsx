"use client";

import { useState } from "react";
import { X, Check, ChevronDown, Calendar, Clock } from "lucide-react";
import Image from "next/image";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: {
        title: string;
        image: string;
        sku: string;
        category?: string;
    };
}

export default function BookingModal({ isOpen, onClose, product }: BookingModalProps) {
    const [formData, setFormData] = useState({
        message: "",
        title: "",
        firstName: "",
        lastName: "",
        email: "",
        telephone: "",
        topic: "Request an appointment",
        date: "",
        time: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/send-enquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    productName: product.title,
                    productSku: product.sku,
                    type: "Booking Request" // Differentiate from general enquiry
                }),
            });

            if (!response.ok) throw new Error("Failed to send booking request");

            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
                setFormData({
                    message: "",
                    title: "",
                    firstName: "",
                    lastName: "",
                    email: "",
                    telephone: "",
                    topic: "Request an appointment",
                    date: "",
                    time: "",
                })
            }, 3000);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-[500px] max-h-[90vh] overflow-y-auto bg-white shadow-2xl">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                    <X size={24} strokeWidth={1} />
                </button>

                <div className="p-8 md:p-10">
                    {/* Header */}
                    <h2 className="text-center font-serif text-2xl text-[#000000] mb-8">
                        Book an Appointment
                    </h2>

                    {/* Product Info */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative w-48 h-48 mb-4">
                            <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <h3 className="text-center font-serif text-lg text-[#000000]">
                            {product.title}
                        </h3>
                        {product.category && (
                            <p className="text-xs uppercase tracking-widest text-[#8B7355] mt-1">
                                {product.category}
                            </p>
                        )}
                    </div>

                    {isSuccess ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                            <div className="w-16 h-16 bg-[#000000] rounded-full flex items-center justify-center text-white mb-2">
                                <Check size={32} />
                            </div>
                            <h3 className="font-serif text-xl text-[#000000]">Request Sent!</h3>
                            <p className="text-neutral-600 font-light">We will confirm your appointment shortly.</p>
                        </div>
                    ) : (
                        /* Form */
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Date and Time Row */}
                            <div className="flex gap-4">
                                <div className="flex-1 relative">
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                        className={`w-full border border-neutral-200 p-3 text-sm font-light focus:border-[#000000] focus:outline-none uppercase peer ${!formData.date ? 'text-transparent' : 'text-neutral-600'}`}
                                    />
                                    <span className={`absolute left-3 top-3 text-sm font-light text-neutral-400 pointer-events-none uppercase transition-opacity peer-focus:opacity-0 ${!formData.date ? 'opacity-100' : 'opacity-0'}`}>
                                        Pick a Date
                                    </span>
                                </div>
                                <div className="flex-1 relative">
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        required
                                        className={`w-full border border-neutral-200 p-3 text-sm font-light focus:border-[#000000] focus:outline-none uppercase peer ${!formData.time ? 'text-transparent' : 'text-neutral-600'}`}
                                    />
                                    <span className={`absolute left-3 top-3 text-sm font-light text-neutral-400 pointer-events-none uppercase transition-opacity peer-focus:opacity-0 ${!formData.time ? 'opacity-100' : 'opacity-0'}`}>
                                        Pick a Time
                                    </span>
                                </div>
                            </div>

                            <div className="h-px bg-neutral-200 my-6" />

                            {/* Message */}
                            <div>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Message (Optional)"
                                    rows={3}
                                    className="w-full border border-neutral-200 p-3 text-sm font-light text-neutral-600 placeholder:text-neutral-400 focus:border-[#000000] focus:outline-none resize-none"
                                />
                            </div>

                            {/* Title */}
                            <div className="relative">
                                <select
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-neutral-200 p-3 text-sm font-light text-neutral-600 focus:border-[#000000] focus:outline-none bg-white appearance-none pr-10"
                                >
                                    <option value="" disabled>Title*</option>
                                    <option value="Mr">Mr</option>
                                    <option value="Mrs">Mrs</option>
                                    <option value="Ms">Ms</option>
                                    <option value="Dr">Dr</option>
                                </select>
                                <ChevronDown
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                                    size={16}
                                    strokeWidth={1.5}
                                />
                            </div>

                            {/* First Name */}
                            <div>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="First Name*"
                                    required
                                    className="w-full border border-neutral-200 p-3 text-sm font-light text-neutral-600 placeholder:text-neutral-400 focus:border-[#000000] focus:outline-none"
                                />
                            </div>

                            {/* Last Name */}
                            <div>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Last Name*"
                                    required
                                    className="w-full border border-neutral-200 p-3 text-sm font-light text-neutral-600 placeholder:text-neutral-400 focus:border-[#000000] focus:outline-none"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email*"
                                    required
                                    className="w-full border border-neutral-200 p-3 text-sm font-light text-neutral-600 placeholder:text-neutral-400 focus:border-[#000000] focus:outline-none"
                                />
                            </div>

                            {/* Telephone */}
                            <div>
                                <input
                                    type="tel"
                                    name="telephone"
                                    value={formData.telephone}
                                    onChange={handleChange}
                                    placeholder="Telephone number*"
                                    required
                                    className="w-full border border-neutral-200 p-3 text-sm font-light text-neutral-600 placeholder:text-neutral-400 focus:border-[#000000] focus:outline-none"
                                />
                            </div>

                            {/* Captcha Placeholder */}
                            <div className="border border-neutral-200 bg-neutral-50 p-3 flex items-center gap-3">
                                <div className="w-6 h-6 border-2 border-neutral-300 rounded-sm" />
                                <span className="text-sm text-neutral-600">I'm not a robot</span>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <p className="text-red-500 text-sm text-center">{error}</p>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black text-white py-4 text-[13px] font-serif uppercase tracking-widest hover:bg-[#000000] transition-colors disabled:opacity-50 mt-6"
                            >
                                {isLoading ? "Sending..." : "REQUEST APPOINTMENT"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
