import Link from 'next/link';
import { Plus, Search, MoreHorizontal, Mail, Phone, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table';

async function getTrainers() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/trainers`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch trainers');
    return await res.json();
  } catch (error) {
    console.error('Error fetching trainers:', error);
    return [];
  }
}

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

export default async function TrainersPage() {
  const trainers = await getTrainers();
  const schedules = await getSchedules();

  // Count schedules per trainer
  const scheduleCount = (trainerId: string) => {
    return schedules.filter((s: any) => s.trainerId === trainerId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Trainers
            </h1>
            <span className="px-3 py-1 text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg">
              {trainers.length}
            </span>
          </div>
          <p className="text-muted-foreground mt-2">Manage your gym trainers and their assignments.</p>
        </div>
        <Link href="/dashboard/trainers/add">
          <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="w-4 h-4" />
            Add Trainer
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search trainers..." className="pl-9" />
        </div>
      </div>

      {trainers.length === 0 ? (
        <div className="border rounded-xl bg-card p-12 text-center">
          <UserCog className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">No trainers yet</h3>
          <p className="text-muted-foreground mb-4">Get started by adding your first trainer</p>
          <Link href="/dashboard/trainers/add">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Trainer
            </Button>
          </Link>
        </div>
      ) : (
        <div className="border rounded-xl bg-card shadow-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Trainer</TableHead>
                <TableHead className="font-semibold">Contact</TableHead>
                <TableHead className="font-semibold">Specialization</TableHead>
                <TableHead className="font-semibold">Schedule</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainers.map((trainer: any) => {
                const initials = trainer.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
                const trainerSchedules = schedules.filter((s: any) => s.trainerId === trainer.id);
                const scheduleDays = [...new Set(trainerSchedules.map((s: any) => s.day))];
                
                return (
                  <TableRow key={trainer.id} className="hover:bg-muted/30 transition-colors duration-200">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold shadow-md">
                          {initials}
                        </div>
                        <div>
                          <p className="font-medium">{trainer.name}</p>
                          <p className="text-xs text-muted-foreground">Certified Trainer</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span>{trainer.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {trainer.specialization ? (
                        <div className="flex flex-wrap gap-1">
                          {trainer.specialization.split(',').map((spec: string, idx: number) => (
                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                              {spec.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No specialization</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {scheduleDays.length > 0 ? (
                        <div className="text-sm">
                          <p className="font-medium text-foreground">{scheduleDays.slice(0, 3).join(', ')}</p>
                          {scheduleDays.length > 3 && (
                            <p className="text-xs">+{scheduleDays.length - 3} more</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs">No schedule</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
