import Navbar from "@/components/Navbar";
import FloatingHelp from "@/components/FloatingHelp";
import NotificationBell from "@/components/NotificationBell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-muted">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-end gap-4">
        <NotificationBell />
      </div>
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
      <FloatingHelp />
    </div>
  );
}
