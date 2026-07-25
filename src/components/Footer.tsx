export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
        <p>Warung Nutrisi - Platform Makan Bergizi Gratis (MBG)</p>
        <p className="mt-1">© {new Date().getFullYear()} Warung Nutrisi</p>
      </div>
    </footer>
  );
}
