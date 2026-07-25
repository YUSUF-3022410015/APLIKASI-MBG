import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingHelp from "@/components/FloatingHelp";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-muted flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">{children}</main>
      <Footer />
      <FloatingHelp />
    </div>
  );
}
