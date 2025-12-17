import { Users, DollarSign, CalendarCheck, TrendingUp, Activity, UserCheck, UserX, CreditCard, Calendar, Award, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
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

export default async function Home() {
  const stats = await getDashboardStats();

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    );
  }

  const revenueGrowthPositive = stats.revenue.growth >= 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 rounded-2xl blur-3xl -z-10" />
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">Welcome back to GMS Pro. Here's what's happening today.</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Members" 
          value={stats.members.total.toString()} 
          subtitle={`${stats.members.active} active, ${stats.members.inactive} inactive`}
          icon={Users}
          gradient="from-blue-500 to-cyan-500"
        />
        <StatsCard 
          title="Active Trainers" 
          value={stats.trainers.total.toString()} 
          subtitle="Certified professionals"
          icon={UserCheck}
          gradient="from-purple-500 to-pink-500"
        />
        <StatsCard 
          title="Monthly Revenue" 
          value={`$${stats.revenue.thisMonth.toFixed(0)}`}
          subtitle={
            <div className="flex items-center gap-1">
              {revenueGrowthPositive ? (
                <ArrowUpRight className="w-3 h-3 text-emerald-600" />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-red-600" />
              )}
              <span className={revenueGrowthPositive ? "text-emerald-600" : "text-red-600"}>
                {Math.abs(stats.revenue.growth)}%
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          }
          icon={DollarSign}
          gradient="from-emerald-500 to-teal-500"
        />
        <StatsCard 
          title="Today's Attendance" 
          value={stats.attendance.today.toString()}
          subtitle="Check-ins today"
          icon={CalendarCheck}
          gradient="from-orange-500 to-red-500"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <MiniStatsCard
          title="Members with Plans"
          value={stats.members.withPlans}
          total={stats.members.total}
          icon={Award}
          color="text-purple-600"
        />
        <MiniStatsCard
          title="Payments This Month"
          value={stats.revenue.paymentsCount}
          subtitle={`$${stats.revenue.thisMonth.toFixed(0)} total`}
          icon={CreditCard}
          color="text-emerald-600"
        />
        <MiniStatsCard
          title="Today's Sessions"
          value={stats.schedules.today.length}
          subtitle="Scheduled classes"
          icon={Calendar}
          color="text-blue-600"
        />
      </div>

      {/* Activity Sections */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <div className="col-span-4 bg-card rounded-xl border border-border p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Check-ins</h2>
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-3">
            {stats.attendance.recent.length > 0 ? (
              stats.attendance.recent.slice(0, 8).map((activity: any) => (
                <div key={activity.id} className="flex items-center gap-4 group hover:bg-muted/50 p-3 rounded-lg transition-colors duration-200">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-semibold shadow-md">
                    {activity.member.firstName[0]}{activity.member.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.member.firstName} {activity.member.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      with {activity.trainer.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent check-ins</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Payments & Today's Schedule */}
        <div className="col-span-3 space-y-6">
          {/* Recent Payments */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Payments</h2>
              <DollarSign className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="space-y-3">
              {stats.payments.recent.length > 0 ? (
                stats.payments.recent.map((payment: any) => (
                  <div key={payment.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {payment.member.firstName} {payment.member.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(payment.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-emerald-600">
                        ${payment.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {payment.method}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <DollarSign className="w-6 h-6 mx-auto mb-1 opacity-50" />
                  <p className="text-xs">No recent payments</p>
                </div>
              )}
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Today's Sessions</h2>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div className="space-y-3">
              {stats.schedules.today.length > 0 ? (
                stats.schedules.today.slice(0, 4).map((schedule: any) => (
                  <div key={schedule.id} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors">
                    <div className="flex-shrink-0 w-12 text-center">
                      <p className="text-xs font-semibold text-primary">{schedule.startTime}</p>
                      <p className="text-xs text-muted-foreground">to</p>
                      <p className="text-xs font-semibold text-primary">{schedule.endTime}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {schedule.trainer.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {schedule.day}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <Clock className="w-6 h-6 mx-auto mb-1 opacity-50" />
                  <p className="text-xs">No sessions today</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, subtitle, icon: Icon, gradient }: any) {
  return (
    <div className="group relative p-6 bg-card rounded-xl border border-border hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300",
        gradient
      )} />
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-bold mt-2">
              {value}
            </h3>
          </div>
          <div className={cn(
            "p-3 rounded-full bg-gradient-to-br shadow-lg flex-shrink-0",
            gradient
          )}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          {subtitle}
        </div>
      </div>
    </div>
  );
}

function MiniStatsCard({ title, value, total, subtitle, icon: Icon, color }: any) {
  const percentage = total ? Math.round((value / total) * 100) : 0;
  
  return (
    <div className="bg-card rounded-xl border border-border p-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-3">
        <Icon className={cn("w-5 h-5", color)} />
        <span className="text-xs text-muted-foreground">{title}</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl font-bold">{value}</h4>
          {total && (
            <span className="text-sm text-muted-foreground">/ {total}</span>
          )}
        </div>
        {total && (
          <div className="w-full bg-muted rounded-full h-1.5">
            <div 
              className={cn("h-1.5 rounded-full", color.replace('text-', 'bg-'))}
              style={{ width: `${percentage}%` }}
            />
          </div>
        )}
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
