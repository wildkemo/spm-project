"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Calendar, Clock, Dumbbell, TrendingUp, Zap, Award, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";

interface Schedule {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

interface TrainerData {
  name: string;
  schedules: Schedule[];
}

export default function TrainerSchedulePage() {
  const [trainerData, setTrainerData] = useState<TrainerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>("");

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
        setSelectedDay(new Date().toLocaleDateString('en-US', { weekday: 'long' }));
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

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const schedulesByDay = daysOfWeek.map(day => ({
    day,
    schedules: trainerData.schedules.filter(s => s.day === day)
  }));

  const totalHours = trainerData.schedules.reduce((total, schedule) => {
    const start = schedule.startTime.split(':');
    const end = schedule.endTime.split(':');
    const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
    const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);
    return total + (endMinutes - startMinutes) / 60;
  }, 0);

  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          My Schedule
        </h2>
        <p className="text-muted-foreground">Manage your weekly training sessions.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Working Days</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {schedulesByDay.filter(d => d.schedules.length > 0).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">days per week</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Dumbbell className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{trainerData.schedules.length}</div>
            <p className="text-xs text-muted-foreground mt-1">sessions per week</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Hours</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Clock className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{Math.round(totalHours)}h</div>
            <p className="text-xs text-muted-foreground mt-1">total training time</p>
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${Math.min(100, (totalHours / 40) * 100)}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Day Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Weekly Schedule Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {daysOfWeek.map(day => {
              const isToday = day === currentDay;
              const hasSchedule = schedulesByDay.find(d => d.day === day)?.schedules.length || 0;
              
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    selectedDay === day
                      ? 'bg-primary text-white shadow-lg'
                      : hasSchedule > 0
                      ? 'bg-primary/10 text-primary hover:bg-primary/20'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  } ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                >
                  {day.slice(0, 3)}
                  {hasSchedule > 0 && (
                    <span className="ml-1 text-xs">({hasSchedule})</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Day Schedule */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              {selectedDay}
              {selectedDay === currentDay && (
                <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">Today</span>
              )}
            </h3>
            {schedulesByDay.find(d => d.day === selectedDay)?.schedules.map((schedule, i) => (
              <div 
                key={schedule.id}
                className="p-4 rounded-lg border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-purple-500/5 hover:shadow-md transition-all animate-fadeIn"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">
                        {schedule.startTime} - {schedule.endTime}
                      </p>
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
                  <div className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                    Training Session
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-sm text-muted-foreground">No sessions scheduled for {selectedDay}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Grid View */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Complete Week View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {schedulesByDay.map((dayData, index) => {
              const isToday = dayData.day === currentDay;
              
              return (
                <div 
                  key={dayData.day}
                  className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                    isToday ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                  } animate-fadeIn`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${isToday ? 'bg-primary text-white' : 'bg-muted'}`}>
                        <Calendar className="h-4 w-4" />
                      </div>
                      <h4 className={`font-semibold ${isToday ? 'text-primary' : ''}`}>
                        {dayData.day} {isToday && '(Today)'}
                      </h4>
                    </div>
                    {dayData.schedules.length > 0 && (
                      <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                        {dayData.schedules.length} session{dayData.schedules.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  
                  {dayData.schedules.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {dayData.schedules.map(schedule => (
                        <div key={schedule.id} className="text-sm bg-muted px-3 py-1 rounded-lg">
                          {schedule.startTime} - {schedule.endTime}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Rest day</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Banners */}
      {totalHours >= 30 && (
        <Card className="border-2 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500 rounded-full">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-green-700 dark:text-green-300">Highly Dedicated!</h3>
                <p className="text-sm text-green-600 dark:text-green-400">
                  You're scheduled for {Math.round(totalHours)} hours this week. Your commitment to training is exceptional! 💪
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {schedulesByDay.filter(d => d.schedules.length > 0).length >= 6 && (
        <Card className="border-2 border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-purple-700 dark:text-purple-300">Full Week Warrior!</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  You're training {schedulesByDay.filter(d => d.schedules.length > 0).length} days this week. Your dedication is inspiring! 🌟
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
