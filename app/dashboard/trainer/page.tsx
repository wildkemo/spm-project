"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { CalendarDays, Users, Clock, Dumbbell, TrendingUp, Zap, Target, Award } from "lucide-react";
import { useEffect, useState } from "react";

interface TrainerData {
  id: string;
  name: string;
  email: string;
  specialization: string | null;
  schedules: Array<{
    id: string;
    day: string;
    startTime: string;
    endTime: string;
  }>;
  stats: {
    todaySchedules: number;
    totalHoursPerWeek: number;
    activeMembers: number;
  };
}

export default function TrainerDashboardPage() {
  const [trainerData, setTrainerData] = useState<TrainerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const user = localStorage.getItem('user');
        if (!user) {
          setError('No user data found');
          setLoading(false);
          return;
        }

        const userData = JSON.parse(user);
        const response = await fetch(`/api/trainer/${userData.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch trainer data');
        }

        const data = await response.json();
        setTrainerData(data);
      } catch (err) {
        console.error('Error fetching trainer data:', err);
        setError('Failed to load trainer data');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !trainerData) {
    return <div className="flex items-center justify-center h-64 text-red-600">{error || 'No trainer data found'}</div>;
  }

  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todaySchedules = trainerData.schedules.filter(s => s.day === currentDay);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Dumbbell className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-4xl font-bold">Welcome, {trainerData.name}!</h2>
              <p className="text-white/90 text-lg">
                {trainerData.specialization ? `${trainerData.specialization} Specialist` : 'Fitness Professional'}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sessions</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <CalendarDays className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{trainerData.stats.todaySchedules}</div>
            <p className="text-xs text-muted-foreground mt-1">sessions scheduled</p>
            <div className="mt-2 flex gap-1">
              {[...Array(Math.min(trainerData.stats.todaySchedules, 8))].map((_, i) => (
                <div key={i} className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Users className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{trainerData.stats.activeMembers}</div>
            <p className="text-xs text-muted-foreground mt-1">subscribed to you</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>Growing community!</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Hours</CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Clock className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{trainerData.stats.totalHoursPerWeek}h</div>
            <p className="text-xs text-muted-foreground mt-1">scheduled per week</p>
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${Math.min(100, (trainerData.stats.totalHoursPerWeek / 40) * 100)}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Today's Schedule - {currentDay}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todaySchedules.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {todaySchedules.map((schedule, i) => (
                <div 
                  key={schedule.id} 
                  className="p-4 rounded-lg border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-purple-500/5 hover:shadow-md transition-all animate-fadeIn"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{schedule.startTime} - {schedule.endTime}</p>
                      <p className="text-sm text-muted-foreground">
                        {(() => {
                          const start = schedule.startTime.split(':');
                          const end = schedule.endTime.split(':');
                          const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
                          const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);
                          const duration = (endMinutes - startMinutes) / 60;
                          return `${duration} hour${duration !== 1 ? 's' : ''} session`;
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarDays className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No sessions today</h3>
              <p className="text-sm text-muted-foreground">Enjoy your day off! 🌟</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Overview */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            This Week's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
              const daySchedules = trainerData.schedules.filter(s => s.day === day);
              const isToday = day === currentDay;
              
              return (
                <div 
                  key={day} 
                  className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                    isToday ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                  } animate-fadeIn`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isToday ? 'bg-primary text-white' : 'bg-muted'}`}>
                        <CalendarDays className="h-4 w-4" />
                      </div>
                      <div>
                        <p className={`font-semibold ${isToday ? 'text-primary' : ''}`}>
                          {day} {isToday && '(Today)'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {daySchedules.length > 0 
                            ? daySchedules.map(s => `${s.startTime} - ${s.endTime}`).join(', ')
                            : 'No sessions'
                          }
                        </p>
                      </div>
                    </div>
                    {daySchedules.length > 0 && (
                      <div className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                        {daySchedules.length} session{daySchedules.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Motivational Banner */}
      {trainerData.stats.totalHoursPerWeek >= 20 && (
        <Card className="border-2 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500 rounded-full">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-green-700 dark:text-green-300">Dedicated Trainer!</h3>
                <p className="text-sm text-green-600 dark:text-green-400">
                  You're scheduled for {trainerData.stats.totalHoursPerWeek} hours this week. Your commitment to helping members is inspiring! 💪
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {trainerData.stats.activeMembers >= 50 && (
        <Card className="border-2 border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-purple-700 dark:text-purple-300">Community Leader!</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  {trainerData.stats.activeMembers} active members are part of our gym community. You're making a real impact! 🌟
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
