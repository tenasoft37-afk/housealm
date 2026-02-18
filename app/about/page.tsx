import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutUs from "@/components/AboutUs";

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-1 pt-20">
                <AboutUs />
            </main>
            <Footer />
        </div>
    );
}
