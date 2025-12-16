import Link from 'next/link';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function SchedulePage() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
          <p className="text-muted-foreground mt-2">Manage weekly class and trainer schedules.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
                <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-medium px-2">Dec 16 - Dec 22, 2024</span>
            <Button variant="outline" size="icon">
                <ChevronRight className="w-4 h-4" />
            </Button>
            <Link href="/schedule/add">
            <Button className="gap-2 ml-2">
                <Plus className="w-4 h-4" />
                Add Session
            </Button>
            </Link>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto border rounded-xl bg-card">
        <div className="min-w-[1000px] grid grid-cols-8 divide-x divide-border">
            {/* Time Column */}
            <div className="col-span-1">
                 <div className="h-12 border-b border-border bg-muted/30"></div>
                 {timeSlots.map((time) => (
                    <div key={time} className="h-20 border-b border-border p-2 text-xs text-muted-foreground text-right relative">
                        <span className="-top-3 relative">{time}</span>
                    </div>
                 ))}
            </div>

            {/* Days Columns */}
            {days.map((day, dayIndex) => (
                <div key={day} className="col-span-1 relative">
                    <div className="h-12 border-b border-border bg-muted/30 flex items-center justify-center font-medium sticky top-0 z-10">
                        {day}
                    </div>
                     {timeSlots.map((time, timeIndex) => (
                        <div key={`${day}-${time}`} className="h-20 border-b border-border relative group">
                             {/* Example Event */}
                             {day === 'Monday' && time === '09:00' && (
                                <div className="absolute inset-1 bg-primary/10 border border-primary/20 rounded-md p-2 hover:bg-primary/20 cursor-pointer overflow-hidden">
                                    <p className="text-xs font-semibold text-primary truncate">HIIT Training</p>
                                    <p className="text-[10px] text-primary/80 truncate">Jane Smith</p>
                                </div>
                             )}
                             {day === 'Wednesday' && time === '14:00' && (
                                <div className="absolute inset-1 bg-purple-100 border border-purple-200 rounded-md p-2 hover:bg-purple-200 cursor-pointer overflow-hidden dark:bg-purple-900/30 dark:border-purple-800">
                                    <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 truncate">Yoga</p>
                                    <p className="text-[10px] text-purple-600 dark:text-purple-400 truncate">Sarah L.</p>
                                </div>
                             )}
                        </div>
                     ))}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
