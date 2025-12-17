"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Dumbbell, Calendar, DollarSign, CheckCircle2, XCircle, Clock, Sparkles, Gift, TrendingUp, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface MemberData {
  id: string;
  firstName: string;
  lastName: string;
  membershipEnd: string;
  joinDate: string;
  status: string;
  plan: {
    id: string;
    name: string;
    duration: number;
    price: number;
    description: string | null;
  } | null;
}

interface Plan {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string | null;
}

export default function MemberPlanPage() {
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const user = localStorage.getItem('user');
      if (!user) {
        setError('No user data found');
        setLoading(false);
        return;
      }

      const userData = JSON.parse(user);
      
      // Fetch member data
      const memberResponse = await fetch(`/api/member/${userData.id}`);
      if (!memberResponse.ok) {
        throw new Error('Failed to fetch member data');
      }
      const memberData = await memberResponse.json();
      setMemberData(memberData);

      // Fetch available plans if member has no active plan
      if (!memberData.plan) {
        const plansResponse = await fetch('/api/plans');
        if (!plansResponse.ok) {
          throw new Error('Failed to fetch plans');
        }
        const plansData = await plansResponse.json();
        setAvailablePlans(plansData);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollPlan = async (planId: string) => {
    if (!memberData) return;

    setActionLoading(true);
    try {
      const response = await fetch('/api/member/enroll-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: memberData.id,
          planId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to enroll in plan');
      }

      // Refresh data
      await fetchData();
    } catch (err) {
      console.error('Error enrolling in plan:', err);
      alert('Failed to enroll in plan. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelPlan = async () => {
    if (!memberData) return;

    const confirmed = window.confirm(
      'Are you sure you want to end your current plan? This action will immediately deactivate your membership.'
    );

    if (!confirmed) return;

    setActionLoading(true);
    try {
      const response = await fetch('/api/member/cancel-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: memberData.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel plan');
      }

      // Refresh data
      await fetchData();
    } catch (err) {
      console.error('Error cancelling plan:', err);
      alert('Failed to cancel plan. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

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

  const daysUntilExpiry = memberData.plan 
    ? Math.ceil((new Date(memberData.membershipEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const isActive = memberData.status === 'Active' && daysUntilExpiry > 0;
  const progressPercentage = memberData.plan
    ? Math.max(0, Math.min(100, (daysUntilExpiry / (memberData.plan.duration * 30)) * 100))
    : 0;

  // Member has an active plan
  if (memberData.plan) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            My Membership Plan
          </h2>
          <p className="text-muted-foreground">Manage your subscription and benefits.</p>
        </div>

        {/* Plan Status Hero Card */}
        <Card className={`relative overflow-hidden border-2 ${isActive ? 'border-green-500' : 'border-red-500'}`}>
          <div className={`absolute inset-0 ${isActive ? 'bg-gradient-to-br from-green-500/5 to-emerald-500/5' : 'bg-gradient-to-br from-red-500/5 to-pink-500/5'}`}></div>
          <CardHeader className="relative">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-3 rounded-xl ${isActive ? 'bg-green-500' : 'bg-red-500'}`}>
                    <Dumbbell className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl">{memberData.plan.name}</CardTitle>
                    {memberData.plan.description && (
                      <p className="text-sm text-muted-foreground mt-1">{memberData.plan.description}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isActive ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                <span className="font-semibold">{isActive ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Time Remaining</span>
                <span className="text-sm font-bold">{daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : 'Expired'}</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${isActive ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-pink-500'}`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Monthly Price</p>
                    <p className="text-xl font-bold">${memberData.plan.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-xl font-bold">{memberData.plan.duration} months</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Days Left</p>
                    <p className="text-xl font-bold">{daysUntilExpiry > 0 ? daysUntilExpiry : 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* End Plan Button */}
            <div className="pt-4 border-t">
              <button
                onClick={handleCancelPlan}
                disabled={actionLoading}
                className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <XCircle className="h-5 w-5" />
                {actionLoading ? 'Processing...' : 'End Plan'}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Details Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Membership Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="font-semibold">{new Date(memberData.joinDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">Expiry Date</span>
                <span className="font-semibold">{new Date(memberData.membershipEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className={`font-semibold ${isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {memberData.status}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                Plan Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: CheckCircle2, text: "Full gym access", color: "text-green-600" },
                { icon: CheckCircle2, text: "All equipment included", color: "text-green-600" },
                { icon: CheckCircle2, text: "Locker facilities", color: "text-green-600" },
                { icon: CheckCircle2, text: "Attendance tracking", color: "text-green-600" },
                { icon: CheckCircle2, text: "Progress monitoring", color: "text-green-600" },
                { icon: Sparkles, text: "Member support", color: "text-purple-600" },
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors animate-fadeIn" style={{ animationDelay: `${i * 100}ms` }}>
                  <benefit.icon className={`h-4 w-4 ${benefit.color}`} />
                  <span className="text-sm">{benefit.text}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Renewal Notices */}
        {daysUntilExpiry <= 7 && daysUntilExpiry > 0 && (
          <Card className="border-2 border-yellow-500 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950 animate-pulse">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-500 rounded-full">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-yellow-800 dark:text-yellow-300">Renewal Reminder</h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Your membership expires in {daysUntilExpiry} days. Please contact the front desk to renew and continue your fitness journey!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {daysUntilExpiry <= 0 && (
          <Card className="border-2 border-red-500 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500 rounded-full">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-red-800 dark:text-red-300">Membership Expired</h3>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    Your membership has expired. Visit the front desk to renew your plan and get back to achieving your fitness goals!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upgrade Suggestion */}
        {isActive && memberData.plan && !memberData.plan.name.includes('Gold') && (
          <Card className="border-2 border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-purple-800 dark:text-purple-300">Upgrade Available!</h3>
                  <p className="text-sm text-purple-700 dark:text-purple-400">
                    Consider upgrading to our Gold Plan for premium benefits and extended access. Ask our staff for details!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Member has no active plan - show available plans
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Choose Your Plan
        </h2>
        <p className="text-muted-foreground">Select a membership plan to get started with your fitness journey.</p>
      </div>

      {/* No Active Plan Notice */}
      <Card className="border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500 rounded-full">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-blue-800 dark:text-blue-300">No Active Plan</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                You don't have an active membership plan. Choose one below to start your fitness journey!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {availablePlans.map((plan) => (
          <Card key={plan.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
              </div>
              {plan.description && (
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="text-xl font-bold text-primary">${plan.price.toFixed(2)}/mo</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="font-semibold">{plan.duration} months</span>
                </div>
              </div>

              <button
                onClick={() => handleEnrollPlan(plan.id)}
                disabled={actionLoading}
                className="w-full px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="h-5 w-5" />
                {actionLoading ? 'Processing...' : 'Enroll Now'}
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {availablePlans.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No plans available at the moment.</p>
            <p className="text-sm text-muted-foreground mt-1">Please contact the front desk for assistance.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
