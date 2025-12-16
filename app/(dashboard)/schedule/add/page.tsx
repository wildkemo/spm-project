import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function AddSchedulePage() {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/schedule">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Schedule Session</h1>
          <p className="text-muted-foreground">Add a new class or trainer session.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Session Title</Label>
            <Input id="title" placeholder="e.g. HIIT Morning Class" />
          </div>
          
           <div className="space-y-2">
            <Label htmlFor="trainer">Trainer</Label>
            <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50">
                <option value="">Select Trainer...</option>
                <option value="1">Jane Smith (HIIT)</option>
                <option value="2">Sarah Lee (Yoga)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="day">Recurring Day</Label>
               <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50">
                <option value="">One time</option>
                <option value="mon">Every Monday</option>
                <option value="tue">Every Tuesday</option>
                <option value="wed">Every Wednesday</option>
                <option value="thu">Every Thursday</option>
                <option value="fri">Every Friday</option>
                <option value="sat">Every Saturday</option>
                <option value="sun">Every Sunday</option>
            </select>
            </div>
          </div>
          
           <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input id="startTime" type="time" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input id="endTime" type="time" />
            </div>
          </div>
          
           <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (Max Members)</Label>
              <Input id="capacity" type="number" placeholder="20" />
            </div>

        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Link href="/schedule">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button className="gap-2">
          <Save className="w-4 h-4" />
          Save Session
        </Button>
      </div>
    </div>
  );
}
