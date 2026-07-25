import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-white font-heading font-semibold">
            <Leaf className="w-5 h-5 text-primary-400" />
            Warung Nutrisi
          </div>
          <p className="text-sm">
            Platform Makan Bergizi Gratis (MBG) — © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
