"use client";

import { useState } from "react";
import { MessageCircle, X, Mail, LifeBuoy } from "lucide-react";

export default function FloatingHelp() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-5 w-72 animate-scale-in origin-bottom-right">
          <h3 className="font-heading font-semibold text-gray-900 mb-2">Butuh Bantuan?</h3>
          <p className="text-sm text-gray-500 mb-4">
            Hubungi tim kami untuk mendapatkan bantuan.
          </p>
          <div className="space-y-2">
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 active:scale-[0.98] transition-all">
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
            <a href="mailto:help@warungnutrisi.id" className="flex items-center gap-3 w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 active:scale-[0.98] transition-all">
              <Mail className="w-5 h-5" />
              Email Helpdesk
            </a>
          </div>
          <button onClick={() => setOpen(false)} className="mt-3 w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors">Tutup</button>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 active:scale-90 transition-all flex items-center justify-center"
        aria-label="Bantuan"
      >
        {open ? <X className="w-6 h-6" /> : <LifeBuoy className="w-6 h-6" />}
      </button>
    </div>
  );
}
