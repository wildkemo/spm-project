import Link from 'next/link';
import { ArrowLeft, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function CheckInPage() {
  return (
    <div className="max-w-xl mx-auto space-y-6 pt-10">
      <div className="flex items-center gap-4">
        <Link href="/attendance">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Access Control</h1>
          <p className="text-muted-foreground">Check-in member via ID or search.</p>
        </div>
      </div>

      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle>Member Check-in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="memberId">Member ID or Name</Label>
            <div className="flex gap-2">
                 <Input id="memberId" placeholder="Scan barcode or type ID/Name..." autoFocus className="flex-1" />
                 <Button>Search</Button>
            </div>
            <p className="text-xs text-muted-foreground">Enter Member ID (e.g. MEM-1001) or scan card.</p>
          </div>
          
          <div className="bg-muted/50 p-6 rounded-lg text-center border border-dashed border-border">
              <p className="text-sm text-muted-foreground">Member details will appear here...</p>
          </div>
            
          <Button className="w-full gap-2" size="lg" disabled>
            <UserCheck className="w-5 h-5" />
            Confirm Check-in
          </Button>
        </CardContent>
      </Card>
      
       <div className="text-center">
            <Link href="/attendance">
                <Button variant="link" className="text-muted-foreground">View Today's Attendance</Button>
            </Link>
        </div>
    </div>
  );
}
