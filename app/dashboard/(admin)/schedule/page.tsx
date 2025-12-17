import Link from 'next/link';
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

async function getSchedules() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/schedules`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch schedules');
    return await res.json();
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return [];
  }
}

export default async function SchedulePage() {
  const schedules = await getSchedules();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  // Group schedules by day and time
  const getScheduleForSlot = (day: string, time: string) => {
    return schedules.find((s: any) => {
      if (s.day !== day) return false;
      const startHour = parseInt(s.startTime.split(':')[0]);
      const slotHour = parseInt(time.split(':')[0]);
      const endHour = parseInt(s.endTime.split(':')[0]);
      return slotHour >= startHour && slotHour < endHour;
    });
  };

  const colors = [
    { bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300', textSub: 'text-blue-600 dark:text-blue-400' },
    { bg: 'bg-purple-100 dark:bg-purple-900/30', border: 'border-purple-200 dark:border-purple-800', text: 'text-purple-700 dark:text-purple-300', textSub: 'text-purple-600 dark:text-purple-400' },
    { bg: 'bg-emerald-100 dark:bg-emerald-900/30', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-300', textSub: 'text-emerald-600 dark:text-emerald-400' },
    { bg: 'bg-orange-100 dark:bg-orange-900/30', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-300', textSub: 'text-orange-600 dark:text-orange-400' },
    { bg: 'bg-pink-100 dark:bg-pink-900/30', border: 'border-pink-200 dark:border-pink-800', text: 'text-pink-700 dark:text-pink-300', textSub: 'text-pink-600 dark:text-pink-400' },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Schedule
            </h1>
            <span className="px-3 py-1 text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full shadow-lg">
              {schedules.length}
            </span>
          </div>
          <p className="text-muted-foreground mt-2">Manage weekly class and trainer schedules.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="hover:bg-muted">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-medium px-2">Dec 16 - Dec 22, 2024</span>
          <Button variant="outline" size="icon" className="hover:bg-muted">
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Link href="/dashboard/schedule/add">
            <Button className="gap-2 ml-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="w-4 h-4" />
              Add Session
            </Button>
          </Link>
        </div>
      </div>

      {schedules.length === 0 ? (
        <div className="border rounded-xl bg-card p-12 text-center">
          <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">No schedules yet</h3>
          <p className="text-muted-foreground mb-4">Create your first training schedule</p>
          <Link href="/dashboard/schedule/add">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Session
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto border rounded-xl bg-card shadow-lg">
          <div className="min-w-[1000px] grid grid-cols-8 divide-x divide-border">
            {/* Time Column */}
            <div className="col-span-1 bg-muted/20">
              <div className="h-12 border-b border-border bg-muted/50 flex items-center justify-center font-semibold sticky top-0 z-20">
                Time
              </div>
              {timeSlots.map((time) => (
                <div key={time} className="h-20 border-b border-border p-2 text-xs text-muted-foreground text-right relative">
                  <span className="-top-3 relative font-medium">{time}</span>
                </div>
              ))}
            </div>

            {/* Days Columns */}
            {days.map((day, dayIndex) => (
              <div key={day} className="col-span-1 relative">
                <div className="h-12 border-b border-border bg-muted/50 flex items-center justify-center font-semibold sticky top-0 z-10">
                  {day}
                </div>
                {timeSlots.map((time, timeIndex) => {
                  const schedule = getScheduleForSlot(day, time);
                  const color = schedule ? colors[parseInt(schedule.trainer.id.charCodeAt(0)) % colors.length] : null;
                  
                  return (
                    <div key={`${day}-${time}`} className="h-20 border-b border-border relative group hover:bg-muted/20 transition-colors">
                      {schedule && (
                        <div className={`absolute inset-1 ${color?.bg} border ${color?.border} rounded-md p-2 hover:shadow-lg cursor-pointer overflow-hidden transition-all duration-200 hover:scale-105`}>
                          <p className={`text-xs font-semibold ${color?.text} truncate`}>
                            {schedule.trainer.specialization || 'Training Session'}
                          </p>
                          <p className={`text-[10px] ${color?.textSub} truncate`}>
                            {schedule.trainer.name}
                          </p>
                          <p className={`text-[9px] ${color?.textSub} opacity-75`}>
                            {schedule.startTime} - {schedule.endTime}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
