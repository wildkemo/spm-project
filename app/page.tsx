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
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-md border-white/10 shadow-2xl bg-black/40 backdrop-blur-xl relative z-10">
        <CardHeader className="space-y-4 text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-2 shadow-lg shadow-indigo-500/20 transform hover:scale-105 transition-transform duration-300">
                 <Dumbbell className="w-8 h-8" />
            </div>
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">GMS Pro</h1>
                 <p className="text-sm text-muted-foreground mt-1">Gym Management System</p>
            </div>
        </CardHeader>
        
        <div className="px-6 mb-6">
            <div className="grid grid-cols-3 p-1.5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                <button
                    onClick={() => handleTypeChange('admin')}
                    className={cn(
                        "flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-medium py-2.5 rounded-lg transition-all duration-200",
                        loginType === 'admin' 
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg" 
                          : "text-muted-foreground hover:text-white hover:bg-white/5"
                    )}
                >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin</span>
                </button>
                <button
                    onClick={() => handleTypeChange('trainer')}
                    className={cn(
                        "flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-medium py-2.5 rounded-lg transition-all duration-200",
                        loginType === 'trainer' 
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg" 
                          : "text-muted-foreground hover:text-white hover:bg-white/5"
                    )}
                >
                    <Dumbbell className="w-4 h-4" />
                    <span>Trainer</span>
                </button>
                <button
                    onClick={() => handleTypeChange('member')}
                    className={cn(
                        "flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-medium py-2.5 rounded-lg transition-all duration-200",
                        loginType === 'member' 
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg" 
                          : "text-muted-foreground hover:text-white hover:bg-white/5"
                    )}
                >
                    <Users className="w-4 h-4" />
                    <span>Member</span>
                </button>
            </div>
        </div>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-5">
            {error && (
              <div className="p-4 text-sm font-medium text-red-200 bg-red-500/10 border border-red-500/20 rounded-lg animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}
            
            <div className="space-y-2.5">
                <Label htmlFor="username" className="text-sm font-medium text-white/80 ml-1">
                    {loginType === 'member' ? 'Member ID / Username' : 'Username'}
                </Label>
                <div className="relative group">
                  <Input 
                      id="username" 
                      type="text" 
                      placeholder={loginType === 'member' ? "Enter your username" : "Enter your username"}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500 focus:ring-indigo-500/20 h-11 transition-all"
                  />
                  <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 group-focus-within:w-full" />
                </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-sm font-medium text-white/80">Password</Label>
                  <Link href="#" className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline transition-colors">Forgot password?</Link>
              </div>
              <div className="relative group">
                <Input 
                  id="password" 
                  type="password" 
                  value={password ?? ''}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500 focus:ring-indigo-500/20 h-11 transition-all"
                />
                <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 group-focus-within:w-full" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-5 pt-2">
             <Button 
                className="w-full h-11 gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02]" 
                type="submit" 
                disabled={isLoading}
             >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
             </Button>
             <p className="text-xs text-white/40 text-center">
              Powering fitness journey since 2024
             </p>
          </CardFooter>
        </form>
      </Card>
      
       <div className="fixed bottom-6 text-center w-full text-xs text-white/20">
        &copy; 2024 GMS Pro. All rights reserved.
      </div>
    </div>
  );
}
