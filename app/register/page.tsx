"use client";

import Link from 'next/link';
import { Dumbbell, ArrowRight, Loader2, Users, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<'trainer' | 'member'>('member');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '', // Used for both firstName+lastName or name
    firstName: '', // helper for separate fields
    lastName: '',  // helper for separate fields
    specialization: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Prepare payload
    const payload: any = {
      role,
      username: formData.username,
      password: formData.password,
      email: formData.email,
    };

    if (role === 'member') {
        const names = formData.fullName.split(' ');
        payload.firstName = names[0] || formData.fullName;
        payload.lastName = names.slice(1).join(' ') || '.'; // Default to dot if no last name
    } else {
        payload.name = formData.fullName;
        payload.specialization = formData.specialization;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Login immediately or redirect to login? Let's redirect to login for simplicity
      router.push('/?registered=true');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md border-primary/10 shadow-xl">
        <CardHeader className="space-y-4 text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-2">
                 <Dumbbell className="w-8 h-8" />
            </div>
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Create Account</h1>
                 <p className="text-sm text-muted-foreground">Join GMS Pro today</p>
            </div>
        </CardHeader>
        
        <div className="px-6 mb-6">
            <div className="grid grid-cols-2 p-1 bg-muted rounded-lg border border-border">
                <button
                    onClick={() => { setRole('member'); setError(''); }}
                    className={cn(
                        "flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-md transition-all",
                        role === 'member' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Users className="w-4 h-4" />
                    Member
                </button>
                <button
                    onClick={() => { setRole('trainer'); setError(''); }}
                    className={cn(
                        "flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-md transition-all",
                        role === 'trainer' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Dumbbell className="w-4 h-4" />
                    Trainer
                </button>
            </div>
        </div>

        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
                <Label htmlFor="fullname">Full Name</Label>
                <Input 
                    id="fullname" 
                    type="text" 
                    placeholder="John Doe" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                    id="username" 
                    type="text" 
                    placeholder="johndoe" 
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                />
            </div>

            {role === 'trainer' && (
                <div className="space-y-2">
                    <Label htmlFor="spec">Specialization</Label>
                    <Input 
                        id="spec" 
                        type="text" 
                        placeholder="Yoga, HIIT, etc." 
                        value={formData.specialization}
                        onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                    />
                </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
             <Button className="w-full gap-2" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Register
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
             </Button>
             <div className="text-center text-sm">
                Already have an account?{' '}
                <Link href="/" className="font-medium text-primary hover:underline">
                    Sign in
                </Link>
             </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
