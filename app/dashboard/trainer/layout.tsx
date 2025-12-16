import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function TrainerDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <div className="flex h-screen bg-background text-foreground">
      <Sidebar role="trainer" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
