import Link from 'next/link';
import { Dumbbell, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md border-primary/10 shadow-xl">
        <CardHeader className="space-y-4 text-center pb-8">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-2">
                 <Dumbbell className="w-8 h-8" />
            </div>
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                 <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
            </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="admin@gms.com" defaultValue="admin@gms.com" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
            <Input id="password" type="password" defaultValue="password" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
           <Link href="/" className="w-full">
                <Button className="w-full gap-2">
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                </Button>
           </Link>
           <p className="text-xs text-muted-foreground text-center">
            Don't have an account? <Link href="#" className="text-primary hover:underline">Contact Admin</Link>
           </p>
        </CardFooter>
      </Card>
      
       <div className="fixed bottom-6 text-center w-full text-xs text-muted-foreground">
        &copy; 2024 GMS Pro. All rights reserved.
      </div>
    </div>
  );
}
