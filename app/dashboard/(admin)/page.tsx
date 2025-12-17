import { Users, DollarSign, CalendarCheck, TrendingUp, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

async function getDashboardStats() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/dashboard`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return await res.json();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
}

async function getTodayAttendance() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/attendance`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch attendance');
    const allAttendance = await res.json();
    const today = new Date().toDateString();
    return allAttendance.filter((a: any) => new Date(a.date).toDateString() === today);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return [];
  }
}

async function getMonthlyRevenue() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/payments`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch payments');
    const payments = await res.json();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyPayments = payments.filter((p: any) => {
      const paymentDate = new Date(p.date);
      return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
    });
    return monthlyPayments.reduce((sum: number, p: any) => sum + p.amount, 0);
  } catch (error) {
    console.error('Error calculating monthly revenue:', error);
    return 0;
  }
}

export default async function Home() {
  const stats = await getDashboardStats();
  const todayAttendance = await getTodayAttendance();
  const monthlyRevenue = await getMonthlyRevenue();

  const memberCount = stats?.memberCount || 0;
  const trainerCount = stats?.trainerCount || 0;
  const todayAttendanceCount = todayAttendance.length;
  const recentActivity = stats?.recentAttendance || [];

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 rounded-2xl blur-3xl -z-10" />
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">Welcome back to GMS Pro. Here's what's happening today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Members" 
          value={memberCount.toString()} 
          change={`${memberCount} active members`}
          icon={Users}
          trend="up"
          gradient="from-blue-500 to-cyan-500"
        />
        <StatsCard 
          title="Active Trainers" 
          value={trainerCount.toString()} 
          change={`${trainerCount} certified trainers`}
          icon={Users}
          trend="neutral"
          gradient="from-purple-500 to-pink-500"
        />
        <StatsCard 
          title="Monthly Revenue" 
          value={`$${monthlyRevenue.toFixed(0)}`}
          change="Current month total" 
          icon={DollarSign}
          trend="up"
          gradient="from-emerald-500 to-teal-500"
        />
        <StatsCard 
          title="Today's Attendance" 
          value={todayAttendanceCount.toString()}
          change={`${todayAttendanceCount} check-ins today`}
          icon={CalendarCheck}
          trend="up"
          gradient="from-orange-500 to-red-500"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 bg-card rounded-xl border border-border p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Revenue Overview</h2>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground bg-gradient-to-br from-muted/20 to-muted/5 rounded-lg border border-dashed border-border relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 text-center">
              <DollarSign className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" />
              <p className="font-medium">Chart Placeholder</p>
              <p className="text-sm text-muted-foreground/70">Revenue analytics coming soon</p>
            </div>
          </div>
        </div>
        
        <div className="col-span-3 bg-card rounded-xl border border-border p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.slice(0, 5).map((activity: any, i: number) => (
                <div key={activity.id} className="flex items-center gap-4 group hover:bg-muted/50 p-2 rounded-lg transition-colors duration-200">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-purple-500 group-hover:scale-125 transition-transform duration-200" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {activity.member.firstName} {activity.member.lastName} checked in
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, change, icon: Icon, trend, gradient }: any) {
  return (
    <div className="group relative p-6 bg-card rounded-xl border border-border hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300",
        gradient
      )} />
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-bold mt-2 bg-gradient-to-r bg-clip-text text-transparent" style={{
              backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
            }}>
              {value}
            </h3>
          </div>
          <div className={cn(
            "p-3 rounded-full bg-gradient-to-br shadow-lg",
            gradient
          )}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs">
          <span className={cn(
            "font-medium px-2 py-0.5 rounded-full",
            trend === 'up' ? "text-emerald-600 bg-emerald-500/10" : "text-muted-foreground bg-muted"
          )}>
            {change}
          </span>
        </div>
      </div>
    </div>
  );
}
