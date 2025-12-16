import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function AddPlanPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/plans">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Membership Plan</h1>
          <p className="text-muted-foreground">Define a new subscription tier.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="planName">Plan Name</Label>
            <Input id="planName" placeholder="e.g. Gold" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Monthly Price ($)</Label>
              <Input id="price" type="number" placeholder="49.99" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (Months)</Label>
              <Input id="duration" type="number" placeholder="1" />
            </div>
          </div>

           <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea 
                id="description" 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Brief description of the plan..."
              />
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Features</CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-3 h-3" />
              Add Feature
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                    <Input placeholder="Feature description..." />
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Link href="/plans">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button className="gap-2">
          <Save className="w-4 h-4" />
          Create Plan
        </Button>
      </div>
    </div>
  );
}
