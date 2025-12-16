import Link from 'next/link';
import { Plus, Search, MoreHorizontal, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table';

export default function TrainersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trainers</h1>
          <p className="text-muted-foreground mt-2">Manage your gym trainers and their assignments.</p>
        </div>
        <Link href="/trainers/add">
          <Button className="gap-2">
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

      <div className="border rounded-xl bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trainer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3].map((i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-medium dark:bg-orange-900/30 dark:text-orange-400">
                      JS
                    </div>
                    <div>
                      <p className="font-medium">Jane Smith</p>
                      <p className="text-xs text-muted-foreground">Certified Trainer</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      <span>jane.smith@example.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      <span>+1 234 567 8900</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border">
                      HIIT
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border">
                      Yoga
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  Mon, Wed, Fri (9AM - 5PM)
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
