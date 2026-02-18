import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import ShopNow from "@/components/ShopNow";
import CommunityGrid from "@/components/Community/CommunityGrid";
import Categories from "@/components/Categories";
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedProducts />
        <ShopNow />
        <CommunityGrid />
        <Categories />
      </main>
      <Footer />
    </div>
  );
}
