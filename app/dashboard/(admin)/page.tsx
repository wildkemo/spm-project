import { Users, DollarSign, CalendarCheck, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back to GMS Pro. Here's what's happening today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Members" 
          value="1,248" 
          change="+12% from last month" 
          icon={Users}
          trend="up"
        />
        <StatsCard 
          title="Active Trainers" 
          value="24" 
          change="+2 new this month" 
          icon={Users}
          trend="neutral"
        />
        <StatsCard 
          title="Monthly Revenue" 
          value="$45,231" 
          change="+8% from last month" 
          icon={DollarSign}
          trend="up"
        />
        <StatsCard 
          title="Today's Attendance" 
          value="143" 
          change="+24% from yesterday" 
          icon={CalendarCheck}
          trend="up"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
            Chart Placeholder
          </div>
        </div>
        <div className="col-span-3 bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New member registered</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, change, icon: Icon, trend }: any) {
  return (
    <div className="p-6 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
        </div>
        <div className="p-3 bg-primary/10 rounded-full text-primary">
          <Icon className="w-5 h-5" />
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
  );
}
