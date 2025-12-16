'use client';

import { Bell, Search, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Header() {
  const [userName, setUserName] = useState('User');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      
      // Determine display name based on user data structure
      if (userData.firstName && userData.lastName) {
        // Member
        setUserName(`${userData.firstName} ${userData.lastName}`);
        setUserRole('Member');
      } else if (userData.name) {
        // Trainer
        setUserName(userData.name);
        setUserRole(userData.specialization ? `Trainer - ${userData.specialization}` : 'Trainer');
      } else if (userData.username) {
        // Admin
        setUserName(userData.username);
        setUserRole('Administrator');
      }
    }
  }, []);

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between px-6">
      <div className="flex items-center w-96 gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-transparent focus-within:border-primary/20 focus-within:bg-card transition-all">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/70"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-card"></span>
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-full">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-muted-foreground">{userRole}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
