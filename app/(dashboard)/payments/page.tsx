import Link from 'next/link';
import { Plus, Search, MoreHorizontal, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table';

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground mt-2">Track membership payments and income.</p>
        </div>
        <Link href="/payments/add">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Record Payment
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search payments..." className="pl-9" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Download className="w-4 h-4" />
        </Button>
      </div>

      <div className="border rounded-xl bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="font-medium">John Doe</div>
                  <div className="text-xs text-muted-foreground">#PAY-{202400 + i}</div>
                </TableCell>
                <TableCell className="font-medium">
                  $59.00
                </TableCell>
                <TableCell>
                  Premium Plan
                </TableCell>
                <TableCell className="text-muted-foreground">
                  Dec {12 - i}, 2024
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                    Paid
                  </span>
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
