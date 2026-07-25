"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  body: string | null;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setUnread(data.filter((n: Notification) => !n.isRead).length);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function markRead(id: string) {
    await fetch("/api/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    setUnread((prev) => Math.max(0, prev - 1));
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2.5 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-xl transition-all" aria-label="Notifikasi">
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-scale-in origin-top-right">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-heading font-semibold text-sm">Notifikasi</h3>
            {unread > 0 && <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-[10px] font-medium rounded-full">{unread} baru</span>}
          </div>

          {notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">Belum ada notifikasi</div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <button key={n.id} onClick={() => markRead(n.id)}
                  className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-all ${!n.isRead ? "bg-primary-50/50" : ""}`}
                >
                  <p className="text-sm font-medium">{n.title}</p>
                  {n.body && <p className="text-xs text-gray-500 mt-1">{n.body}</p>}
                  <p className="text-[10px] text-gray-400 mt-2">{new Date(n.createdAt).toLocaleDateString("id-ID")}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
