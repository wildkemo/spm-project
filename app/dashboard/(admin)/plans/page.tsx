import Link from 'next/link';
import { Plus, Check, MoreHorizontal, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

async function getPlans() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/plans`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch plans');
    return await res.json();
  } catch (error) {
    console.error('Error fetching plans:', error);
    return [];
  }
}

async function getMembers() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/members`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch members');
    return await res.json();
  } catch (error) {
    console.error('Error fetching members:', error);
    return [];
  }
}

export default async function PlansPage() {
  const plans = await getPlans();
  const members = await getMembers();

  // Count members per plan
  const getMemberCount = (planId: string) => {
    return members.filter((m: any) => m.planId === planId).length;
  };

  // Find most popular plan
  const planCounts = plans.map((p: any) => ({ id: p.id, count: getMemberCount(p.id) }));
  const maxCount = Math.max(...planCounts.map(pc => pc.count), 0);
  const popularPlanId = planCounts.find(pc => pc.count === maxCount)?.id;

  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-red-500',
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Membership Plans
            </h1>
            <span className="px-3 py-1 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-lg">
              {plans.length}
            </span>
          </div>
          <p className="text-muted-foreground mt-2">Manage subscription tiers and pricing.</p>
        </div>
        <Link href="/dashboard/plans/add">
          <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="w-4 h-4" />
            Create Plan
          </Button>
        </Link>
      </div>

      {plans.length === 0 ? (
        <div className="border rounded-xl bg-card p-12 text-center">
          <CreditCard className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">No membership plans yet</h3>
          <p className="text-muted-foreground mb-4">Create your first membership plan to get started</p>
          <Link href="/dashboard/plans/add">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Plan
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan: any, index: number) => {
            const memberCount = getMemberCount(plan.id);
            const isPopular = plan.id === popularPlanId && memberCount > 0;
            const gradient = gradients[index % gradients.length];

            return (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                  isPopular ? 'border-primary shadow-lg bg-primary/5' : 'hover:border-primary/50'
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg shadow-lg">
                    POPULAR
                  </div>
                )}
                <div className="absolute top-0 right-12 p-4">
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />
                
                <CardHeader className="relative">
                  <CardTitle className="text-xl flex items-center justify-between">
                    <span>{plan.name}</span>
                    <span className="text-xs font-normal px-2 py-1 bg-muted rounded-full">
                      {memberCount} {memberCount === 1 ? 'member' : 'members'}
                    </span>
                  </CardTitle>
                  <div className="flex items-baseline gap-1 mt-2">
                    <p className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                      ${plan.price}
                    </p>
                    <span className="text-sm font-normal text-muted-foreground">
                      / {plan.duration} {plan.duration === 1 ? 'month' : 'months'}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="relative">
                  <p className="text-sm text-muted-foreground mb-6">
                    {plan.description || 'No description available'}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className={`p-1 rounded-full bg-gradient-to-r ${gradient}`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span>Access to gym equipment</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className={`p-1 rounded-full bg-gradient-to-r ${gradient}`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span>Locker usage</span>
                    </div>
                    {plan.duration >= 3 && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className={`p-1 rounded-full bg-gradient-to-r ${gradient}`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span>Group classes</span>
                      </div>
                    )}
                    {plan.duration >= 6 && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className={`p-1 rounded-full bg-gradient-to-r ${gradient}`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span>Personal training sessions</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
