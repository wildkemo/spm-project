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

export default function LoginPage() {
  const router = useRouter();
  const [loginType, setLoginType] = useState<'admin' | 'trainer' | 'member'>('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Clear inputs when switching login type
  const handleTypeChange = (type: 'admin' | 'trainer' | 'member') => {
    setLoginType(type);
    setError('');
    setUsername('');
    setPassword('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role: loginType }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Check if the user's role matches the selected login type
      // Note: This is a simple client-side check. In a real app, the API should validate this.
      // Roles in DB: 'Admin' | 'Staff' | 'Trainer' | 'Member' (assuming 'Member' role exists or we treat them differently)
      // We'll be lenient here and just check if the user exists, but ideally:
      const userRole = data.user.role?.toLowerCase(); // 'admin', 'staff', 'trainer'
      
      // Simple role mapping/validation
      let validLogin = false;
      if (loginType === 'admin') {
         if (userRole === 'admin' || userRole === 'staff') validLogin = true;
      } else if (loginType === 'trainer') {
         if (userRole === 'trainer') validLogin = true;
      } else if (loginType === 'member') {
         // Assuming valid member login if no explicit role is 'admin'/'trainer' 
         // or if we have a specific 'member' role. 
         // For now, let's assume any other role is valid for Member login? 
         // Or strictly 'member'. Let's assume strict 'member' role or allow if the DB user is meant to be a member.
         // Given the schema has `Member` model separate from `User`, we need to clarify. 
         // BUT standard SRS says "System shall identify users by role". 
         // Let's assume the User table has role='Member' for members too for simplicity of auth, 
         // OR we just allow login and route based on role.
         if (userRole === 'member') validLogin = true;
      }

      // For now, let's just trust the role returning from DB and redirect accordingly, 
      // rather than blocking login if they picked the wrong tab (UX choice).
      // Actually, better to just redirect based on the ACTUAL role.
      
      localStorage.setItem('user', JSON.stringify(data.user));
      
      if (userRole === 'admin' || userRole === 'staff') {
        router.push('/dashboard');
      } else if (userRole === 'trainer') {
        router.push('/dashboard/trainer');
      } else if (userRole === 'member') {
        router.push('/dashboard/member');
      } else {
        // Fallback
        router.push('/dashboard');
      }

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
                <h1 className="text-2xl font-bold tracking-tight">GMS Pro</h1>
                 <p className="text-sm text-muted-foreground">Gym Management System</p>
            </div>
        </CardHeader>
        
        <div className="px-6 mb-6">
            <div className="grid grid-cols-3 p-1 bg-muted rounded-lg border border-border">
                <button
                    onClick={() => handleTypeChange('admin')}
                    className={cn(
                        "flex items-center justify-center gap-2 text-xs font-medium py-2 rounded-md transition-all",
                        loginType === 'admin' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <ShieldCheck className="w-3 h-3" />
                    Admin
                </button>
                <button
                    onClick={() => handleTypeChange('trainer')}
                    className={cn(
                        "flex items-center justify-center gap-2 text-xs font-medium py-2 rounded-md transition-all",
                        loginType === 'trainer' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Dumbbell className="w-3 h-3" />
                    Trainer
                </button>
                <button
                    onClick={() => handleTypeChange('member')}
                    className={cn(
                        "flex items-center justify-center gap-2 text-xs font-medium py-2 rounded-md transition-all",
                        loginType === 'member' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Users className="w-3 h-3" />
                    Member
                </button>
            </div>
        </div>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
                <Label htmlFor="username">
                    {loginType === 'member' ? 'Member ID / Username' : 'Username'}
                </Label>
                <Input 
                    id="username" 
                    type="text" 
                    placeholder={loginType === 'member' ? "Enter your username" : "admin"}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password ?? ''}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
             <Button className="w-full gap-2" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
             </Button>
             <p className="text-xs text-muted-foreground text-center mt-2">
              Powering fitness journey since 2024
             </p>
          </CardFooter>
        </form>
      </Card>
      
       <div className="fixed bottom-6 text-center w-full text-xs text-muted-foreground">
        &copy; 2024 GMS Pro. All rights reserved.
      </div>
    </div>
  );
}
