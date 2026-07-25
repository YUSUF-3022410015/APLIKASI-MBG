import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingHelp from "@/components/FloatingHelp";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">{children}</main>
      <Footer />
      <FloatingHelp />
    </div>
  );
}
