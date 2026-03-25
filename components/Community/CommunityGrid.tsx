"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Play, Mail, ArrowRight, Instagram } from "lucide-react";
import { CommunityPost } from "./mockPosts";
import CommunityModal from "./CommunityModal";

interface InstagramData {
    id: string;
    logo: string;
    accountName: string;
    posts: CommunityPost[];
}

export default function CommunityGrid() {
    const [instagramData, setInstagramData] = useState<InstagramData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPostIndex, setSelectedPostIndex] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activePostId, setActivePostId] = useState<string | null>(null);

    const [email, setEmail] = useState("");
    const [joinStatus, setJoinStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    // Fetch Instagram data from API
    useEffect(() => {
        const fetchInstagramData = async () => {
            try {
                const response = await fetch('/api/instagram');
                if (!response.ok) {
                    throw new Error('Failed to fetch Instagram data');
                }
                const data = await response.json();
                setInstagramData(data);
            } catch (err) {
                console.error('Error fetching Instagram data:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };
        fetchInstagramData();
    }, []);

    const displayedPosts = instagramData?.posts.slice(0, 8) || [];
    const selectedPost = selectedPostIndex !== null ? displayedPosts[selectedPostIndex] : null;

    const handlePostClick = (post: CommunityPost, index: number) => {
        // On mobile: first tap shows overlay, second tap opens modal
        // On desktop: always open modal (hover handles overlay)
        if (activePostId === post.id) {
            // Second tap - open modal
            setSelectedPostIndex(index);
            setIsModalOpen(true);
            setActivePostId(null);
        } else {
            // First tap - show overlay
            setActivePostId(post.id);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPostIndex(null);
    };

    const handlePrevious = () => {
        if (selectedPostIndex !== null && selectedPostIndex > 0) {
            setSelectedPostIndex(selectedPostIndex - 1);
        }
    };

    const handleNext = () => {
        if (selectedPostIndex !== null && selectedPostIndex < displayedPosts.length - 1) {
            setSelectedPostIndex(selectedPostIndex + 1);
        }
    };

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setJoinStatus('loading');

        try {
            const response = await fetch("/api/send-enquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    type: "Community Join"
                }),
            });

            if (!response.ok) throw new Error("Failed to join");

            setJoinStatus('success');
            setEmail("");
            setTimeout(() => setJoinStatus('idle'), 3000);
        } catch (err) {
            console.error(err);
            setJoinStatus('error');
            setTimeout(() => setJoinStatus('idle'), 3000);
        }
    };

    return (
        <section className="w-full py-12 md:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-8">
                    <Mail className="w-8 h-8 text-[#5B3A82] mb-4 stroke-[1.5]" />
                    <h2 className="text-3xl md:text-4xl font-normal text-[#5B3A82] mb-8">
                        Join Our Community
                    </h2>

                    {/* Newsletter Form */}
                    <form onSubmit={handleJoin} className="w-full max-w-xl space-y-4 mb-12">
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="E-mail"
                                required
                                className="w-full px-6 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-[#5B3A82] text-gray-600 placeholder:text-gray-400 disabled:opacity-50"
                                disabled={joinStatus === 'loading' || joinStatus === 'success'}
                            />
                            {joinStatus === 'success' && (
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 text-sm font-medium">Joined!</span>
                            )}
                            {joinStatus === 'error' && (
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-600 text-sm font-medium">Error</span>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={joinStatus === 'loading' || joinStatus === 'success'}
                            className="w-full bg-[#5B3A82] text-white rounded-full py-3 px-6 flex items-center justify-center gap-2 hover:bg-[#4a2e6b] transition-colors group disabled:opacity-70"
                        >
                            <span>{joinStatus === 'loading' ? 'Joining...' : 'Join'}</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#5B3A82] border-r-transparent"></div>
                        <p className="mt-4 text-gray-600">Loading posts...</p>
                    </div>
                )}



                {/* Grid - Fluidly Responsive */}
                {!loading && !error && displayedPosts.length > 0 && (
                    <>
                        <div className="grid grid-cols-4 gap-2 md:gap-4 mb-8 mx-auto w-full max-w-[340px] md:max-w-[1320px]">
                            {displayedPosts.map((post, index) => {
                                const isActive = activePostId === post.id;
                                return (
                                    <button
                                        key={post.id}
                                        onClick={() => handlePostClick(post, index)}
                                        className="relative w-full aspect-[4/5] rounded-lg overflow-hidden group cursor-pointer focus:outline-none"
                                    >
                                        {/* Cover Image */}
                                        <Image
                                            src={post.cover}
                                            alt={post.caption}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                        />

                                        {/* Hover/Active Overlay with Icon */}
                                        <div className={`absolute inset-0 flex items-center justify-center transition-colors duration-300 ${isActive ? 'bg-[#5B3A82]/40' : 'bg-[#5B3A82]/0 md:group-hover:bg-[#5B3A82]/40'}`}>
                                            {post.type === "video" ? (
                                                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white flex items-center justify-center transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'}`}>
                                                    <Play size={20} className="text-white ml-0.5" fill="currentColor" />
                                                </div>
                                            ) : (
                                                <Instagram size={24} className={`text-white transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'}`} strokeWidth={1.5} />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Instagram Handle */}
                        <div className="text-center">
                            <a
                                href={`https://instagram.com/${instagramData?.accountName || 'thehouseofalmas'}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block"
                            >
                                <span className="text-lg text-[#5B3A82] hover:text-[#4a2e6b] border-b border-[#C8A2C8] pb-0.5">
                                    @{instagramData?.accountName || 'thehouseofalmas'}
                                </span>
                            </a>
                        </div>
                    </>
                )}
            </div>

            {/* Modal */}
            <CommunityModal
                post={selectedPost}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onPrevious={selectedPostIndex !== null && selectedPostIndex > 0 ? handlePrevious : undefined}
                onNext={selectedPostIndex !== null && selectedPostIndex < displayedPosts.length - 1 ? handleNext : undefined}
                accountName={instagramData?.accountName}
                logo={instagramData?.logo}
            />
        </section>
    );
}
