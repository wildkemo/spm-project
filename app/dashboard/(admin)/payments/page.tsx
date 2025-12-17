import Link from 'next/link';
import { Plus, Search, MoreHorizontal, Download, Filter, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table';

async function getPayments() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/payments`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch payments');
    return await res.json();
  } catch (error) {
    console.error('Error fetching payments:', error);
    return [];
  }
}

export default async function PaymentsPage() {
  const payments = await getPayments();
  const totalRevenue = payments.reduce((sum: number, p: any) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Payments
            </h1>
            <span className="px-3 py-1 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-lg">
              {payments.length}
            </span>
          </div>
          <p className="text-muted-foreground mt-2">Track membership payments and income.</p>
        </div>
        <Link href="/dashboard/payments/add">
          <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="w-4 h-4" />
            Record Payment
          </Button>
        </Link>
      </div>

      {/* Total Revenue Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-sm font-medium">Total Revenue</p>
            <h2 className="text-4xl font-bold mt-2">${totalRevenue.toFixed(2)}</h2>
            <p className="text-emerald-100 text-xs mt-1">From {payments.length} transactions</p>
          </div>
          <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
            <DollarSign className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search payments..." className="pl-9" />
        </div>
        <Button variant="outline" size="icon" className="hover:bg-muted">
          <Filter className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" className="hover:bg-muted">
          <Download className="w-4 h-4" />
        </Button>
      </div>

      {payments.length === 0 ? (
        <div className="border rounded-xl bg-card p-12 text-center">
          <DollarSign className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">No payments recorded yet</h3>
          <p className="text-muted-foreground mb-4">Start recording payments to track your revenue</p>
          <Link href="/dashboard/payments/add">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Record Payment
            </Button>
          </Link>
        </div>
      ) : (
        <div className="border rounded-xl bg-card shadow-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Member</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Method</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment: any) => (
                <TableRow key={payment.id} className="hover:bg-muted/30 transition-colors duration-200">
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {payment.member.firstName} {payment.member.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">#{payment.id.slice(0, 8)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      ${payment.amount.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      payment.method === 'Card' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      {payment.method}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(payment.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                      Paid
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
