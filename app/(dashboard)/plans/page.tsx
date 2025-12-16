import Link from 'next/link';
import { Plus, Check, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function PlansPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Membership Plans</h1>
          <p className="text-muted-foreground mt-2">Manage subscription tiers and pricing.</p>
        </div>
        <Link href="/plans/add">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Plan
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Basic Plan */}
        <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
          <div className="absolute top-0 right-0 p-4">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          <CardHeader>
            <CardTitle className="text-xl">Basic</CardTitle>
            <p className="text-3xl font-bold mt-2">$29 <span className="text-sm font-normal text-muted-foreground">/ month</span></p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">Essential access to gym facilities.</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>Access to gym equipment</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>Locker usage</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 opacity-50" />
                <span>Group classes</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className="relative overflow-hidden border-2 border-primary shadow-lg bg-primary/5">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
            POPULAR
          </div>
           <div className="absolute top-0 right-12 p-4">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          <CardHeader>
            <CardTitle className="text-xl">Premium</CardTitle>
            <p className="text-3xl font-bold mt-2">$59 <span className="text-sm font-normal text-muted-foreground">/ month</span></p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">Full access to all facilities and classes.</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>Access to gym equipment</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>Locker usage</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>Unlimited Group classes</span>
              </li>
               <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>Sauna access</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* VIP Plan */}
        <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
           <div className="absolute top-0 right-0 p-4">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          <CardHeader>
            <CardTitle className="text-xl">VIP</CardTitle>
            <p className="text-3xl font-bold mt-2">$99 <span className="text-sm font-normal text-muted-foreground">/ month</span></p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">The ultimate fitness experience.</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>All Premium features</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>Personal Trainer (2x/mo)</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>Nutrition Consultation</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>Private Lounge Access</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
