'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Dumbbell, 
  CreditCard, 
  CalendarCheck, 
  CalendarDays,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface SidebarProps {
  role?: 'admin' | 'staff' | 'trainer' | 'member';
}

export function Sidebar({ role = 'admin' }: SidebarProps) {
  const pathname = usePathname();
  
  // Define navigation based on role
  let navItems: { name: string; href: string; icon: any }[] = [];

  if (role === 'admin' || role === 'staff') {
    navItems = [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Members', href: '/dashboard/members', icon: Users },
      { name: 'Trainers', href: '/dashboard/trainers', icon: Users },
      { name: 'Plans', href: '/dashboard/plans', icon: Dumbbell },
      { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },

      { name: 'Schedule', href: '/dashboard/schedule', icon: CalendarDays },
    ];
  } else if (role === 'trainer') {
    navItems = [
      { name: 'Dashboard', href: '/dashboard/trainer', icon: LayoutDashboard },
      { name: 'Members', href: '/dashboard/trainer/members', icon: Users },
      { name: 'My Schedule', href: '/dashboard/trainer/schedule', icon: CalendarDays },
      { name: 'Attendance Check', href: '/dashboard/trainer/attendance', icon: CalendarCheck },
    ];
  } else if (role === 'member') {
    navItems = [
      { name: 'Dashboard', href: '/dashboard/member', icon: LayoutDashboard },
      { name: 'My Plan', href: '/dashboard/member/plan', icon: Dumbbell },
      { name: 'My Trainers', href: '/dashboard/member/trainers', icon: Users },
      { name: 'My Attendance', href: '/dashboard/member/attendance', icon: CalendarCheck },
    ];
  }

  return (
    <div className="flex flex-col h-screen w-64 bg-card border-r border-border sticky top-0">
      <div className="p-6 border-b border-border flex items-center gap-2">
        <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <Dumbbell className="w-6 h-6" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">GMS Pro</span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
              )} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-red-600 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </div>
  );
}
