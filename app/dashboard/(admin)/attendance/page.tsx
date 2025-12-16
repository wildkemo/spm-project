import Link from 'next/link';
import { UserCheck, Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table';

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground mt-2">Monitor daily gym visits.</p>
        </div>
        <Link href="/attendance/check-in">
          <Button className="gap-2">
            <UserCheck className="w-4 h-4" />
            Check-in Member
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search member..." className="pl-9" />
        </div>
        <div className="relative max-w-sm">
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="date" className="pl-9" />
        </div>
      </div>

      <div className="border rounded-xl bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Check-in Time</TableHead>
              <TableHead>Check-out Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                 <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium dark:bg-slate-800 dark:text-slate-400">
                      JD
                    </div>
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-xs text-muted-foreground">#MEM-100{i}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  09:{30 + i} AM
                </TableCell>
                <TableCell className="text-muted-foreground">
                    -
                </TableCell>
                <TableCell className="text-muted-foreground">
                    In Progress
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    Active
                  </span>
                </TableCell>
              </TableRow>
            ))}
             <TableRow>
                 <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium dark:bg-slate-800 dark:text-slate-400">
                      AS
                    </div>
                    <div>
                      <p className="font-medium">Alice Smith</p>
                      <p className="text-xs text-muted-foreground">#MEM-1010</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  08:15 AM
                </TableCell>
                <TableCell>
                  09:45 AM
                </TableCell>
                <TableCell>
                  1h 30m
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                    Completed
                  </span>
                </TableCell>
              </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
