"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Dumbbell, CalendarCheck, TrendingUp, CreditCard, Clock, Award, Zap, Target, Activity } from "lucide-react";
import { useEffect, useState } from "react";

interface MemberData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  membershipEnd: string;
  joinDate: string;
  plan: {
    name: string;
    duration: number;
    price: number;
  } | null;
  payments: Array<{
    id: string;
    amount: number;
    date: string;
    method: string;
  }>;
  attendance: Array<{
    id: string;
    date: string;
  }>;
}

export default function MemberDashboardPage() {
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const user = localStorage.getItem('user');
        if (!user) {
          setError('No user data found');
          setLoading(false);
          return;
        }

        const userData = JSON.parse(user);
        const response = await fetch(`/api/member/${userData.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch member data');
        }

        const data = await response.json();
        setMemberData(data);
      } catch (err) {
        console.error('Error fetching member data:', err);
        setError('Failed to load member data');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !memberData) {
    return <div className="flex items-center justify-center h-64 text-red-600">{error || 'No member data found'}</div>;
  }

  const daysUntilExpiry = Math.ceil((new Date(memberData.membershipEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const thisMonthAttendance = memberData.attendance.filter((a) => {
    const date = new Date(a.date);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;
  const totalPaid = memberData.payments.reduce((sum, p) => sum + p.amount, 0);
  const memberSince = Math.floor((new Date().getTime() - new Date(memberData.joinDate).getTime()) / (1000 * 60 * 60 * 24 * 30));

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-purple-600 to-pink-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Dumbbell className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-4xl font-bold">Welcome back, {memberData.firstName}!</h2>
              <p className="text-white/90 text-lg">Ready to crush your fitness goals today?</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Dumbbell className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {memberData.plan?.name || 'No Plan'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {daysUntilExpiry > 0 ? `${daysUntilExpiry} days remaining` : 'Expired'}
            </p>
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-500"
                style={{ width: `${Math.max(0, Math.min(100, (daysUntilExpiry / (memberData.plan?.duration || 1) / 30) * 100))}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CalendarCheck className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{thisMonthAttendance}</div>
            <p className="text-xs text-muted-foreground mt-1">gym visits</p>
            <div className="mt-2 flex gap-1">
              {[...Array(Math.min(thisMonthAttendance, 20))].map((_, i) => (
                <div key={i} className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 50}ms` }}></div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{memberData.attendance.length}</div>
            <p className="text-xs text-muted-foreground mt-1">all time</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
              <Activity className="h-3 w-3" />
              <span>Keep it up!</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Award className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{memberSince}</div>
            <p className="text-xs text-muted-foreground mt-1">months strong</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-purple-600">
              <Zap className="h-3 w-3" />
              <span>Dedicated member!</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Plan Details */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Membership Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Plan Duration</span>
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-bold">{memberData.plan?.duration || 0} months</div>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-lg border border-green-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Total Investment</span>
                <CreditCard className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">{memberData.payments.length} payments</p>
            </div>

            <div className={`p-4 rounded-lg border ${
              memberData.status === 'Active' 
                ? 'bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20' 
                : 'bg-gradient-to-br from-red-500/5 to-pink-500/5 border-red-500/20'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Status</span>
                <Award className="h-4 w-4" />
              </div>
              <div className={`text-2xl font-bold ${memberData.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                {memberData.status}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {memberData.attendance.length > 0 ? (
              <div className="space-y-3">
                {memberData.attendance.slice(0, 6).map((a, i) => (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors animate-fadeIn" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CalendarCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Gym Check-in</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(a.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(a.date).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-sm text-muted-foreground">No attendance records yet</p>
                <p className="text-xs text-muted-foreground mt-1">Start your fitness journey today!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Motivational Banner */}
      {thisMonthAttendance >= 10 && (
        <Card className="border-2 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500 rounded-full">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-green-700 dark:text-green-300">Amazing Progress!</h3>
                <p className="text-sm text-green-600 dark:text-green-400">
                  You've visited the gym {thisMonthAttendance} times this month. Keep crushing it! 💪
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
