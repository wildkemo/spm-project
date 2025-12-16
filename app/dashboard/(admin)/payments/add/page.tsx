import Link from 'next/link';
import { ArrowLeft, Save, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function RecordPaymentPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/payments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Record Payment</h1>
          <p className="text-muted-foreground">Manually record a membership payment.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="member">Select Member</Label>
            <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50">
                <option value="">Search by name or ID...</option>
                <option value="1">John Doe (#MEM-1001)</option>
                <option value="2">Jane Smith (#MEM-1002)</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input id="amount" type="number" placeholder="0.00" />
            </div>
            
             <div className="space-y-2">
              <Label htmlFor="method">Payment Method</Label>
              <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50">
                <option value="cash">Cash</option>
                <option value="card">Credit Card</option>
                <option value="transfer">Bank Transfer</option>
              </select>
            </div>
          </div>
          
           <div className="space-y-2">
            <Label htmlFor="date">Payment Date</Label>
            <Input id="date" type="date" />
          </div>

           <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <textarea 
                id="notes" 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Additional details..."
              />
            </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Link href="/payments">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button className="gap-2">
          <Save className="w-4 h-4" />
          Record Payment
        </Button>
      </div>
    </div>
  );
}
