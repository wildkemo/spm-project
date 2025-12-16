"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { CalendarCheck, TrendingUp, Calendar, Flame, Target, Award, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";

interface AttendanceRecord {
  id: string;
  date: string;
}

interface MemberData {
  firstName: string;
  lastName: string;
  attendance: AttendanceRecord[];
}

export default function MemberAttendancePage() {
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const user = localStorage.getItem('user');
        if (!user) {
          setError('No user data found');
          setLoading(false);
          return;
        }

        const userData = JSON.parse(user);
        const response = await fetch(`/api/member/${userData.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch member data');
        }

        const data = await response.json();
        setMemberData(data);
      } catch (err) {
        console.error('Error fetching member data:', err);
        setError('Failed to load member data');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !memberData) {
    return <div className="flex items-center justify-center h-64 text-red-600">{error || 'No member data found'}</div>;
  }

  const attendance = memberData.attendance;
  
  // Calculate stats
  const now = new Date();
  const thisMonth = attendance.filter(a => {
    const date = new Date(a.date);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });

  const lastMonth = attendance.filter(a => {
    const date = new Date(a.date);
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return date.getMonth() === lastMonthDate.getMonth() && date.getFullYear() === lastMonthDate.getFullYear();
  });

  const thisWeek = attendance.filter(a => {
    const date = new Date(a.date);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return date >= weekAgo;
  });

  // Calculate streak
  let currentStreak = 0;
  const sortedAttendance = [...attendance].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sortedAttendance.length; i++) {
    const attendanceDate = new Date(sortedAttendance[i].date);
    attendanceDate.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((today.getTime() - attendanceDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === currentStreak || (currentStreak === 0 && daysDiff <= 1)) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Group by month for history
  const groupedByMonth = attendance.reduce((acc: any, record) => {
    const date = new Date(record.date);
    const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(record);
    return acc;
  }, {});

  const months = Object.keys(groupedByMonth).reverse();
  const displayMonth = selectedMonth || months[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          My Attendance
        </h2>
        <p className="text-muted-foreground">Track your gym visits and stay consistent.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Flame className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{currentStreak}</div>
            <p className="text-xs text-muted-foreground mt-1">days in a row</p>
            {currentStreak >= 7 && (
              <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
                <Award className="h-3 w-3" />
                <span>On fire! 🔥</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <CalendarCheck className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{thisWeek.length}</div>
            <p className="text-xs text-muted-foreground mt-1">visits</p>
            <div className="mt-2 flex gap-1">
              {[...Array(7)].map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i < thisWeek.length ? 'bg-blue-500' : 'bg-muted'}`}></div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Calendar className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{thisMonth.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {lastMonth.length > 0 && (
                <span className={thisMonth.length >= lastMonth.length ? 'text-green-600' : 'text-red-600'}>
                  {thisMonth.length >= lastMonth.length ? '↑' : '↓'} {Math.abs(thisMonth.length - lastMonth.length)} from last month
                </span>
              )}
              {lastMonth.length === 0 && 'visits'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{attendance.length}</div>
            <p className="text-xs text-muted-foreground mt-1">all time</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Overview */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Monthly Overview
            </CardTitle>
            <select
              value={displayMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
            {groupedByMonth[displayMonth]?.map((record: AttendanceRecord) => {
              const date = new Date(record.date);
              return (
                <div key={record.id} className="aspect-square p-2 bg-primary/10 rounded-lg flex items-center justify-center text-xs font-medium hover:bg-primary/20 transition-colors cursor-pointer" title={date.toLocaleDateString()}>
                  {date.getDate()}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Attendance History */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-primary" />
            Attendance History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {attendance.length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedByMonth).reverse().slice(0, 3).map(([monthYear, records]: [string, any]) => (
                <div key={monthYear} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-muted-foreground">{monthYear}</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                      {records.length} visits
                    </span>
                  </div>
                  <div className="grid gap-2">
                    {records.slice(0, 5).map((record: AttendanceRecord, i: number) => (
                      <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-all hover:shadow-md animate-fadeIn" style={{ animationDelay: `${i * 50}ms` }}>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <CalendarCheck className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Gym Check-in</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(record.date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                month: 'long', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(record.date).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarCheck className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No attendance records yet</h3>
              <p className="text-sm text-muted-foreground">
                Your gym visits will appear here once you check in at the front desk.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Motivational Cards */}
      {currentStreak >= 7 && (
        <Card className="border-2 border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500 rounded-full animate-pulse">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-orange-700 dark:text-orange-300">You're on Fire! 🔥</h3>
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  {currentStreak} day streak! Keep this momentum going. You're crushing it!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {thisMonth.length >= 15 && (
        <Card className="border-2 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500 rounded-full">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-green-700 dark:text-green-300">Consistency Champion!</h3>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {thisMonth.length} visits this month! Your dedication is inspiring. Keep up the amazing work! 💪
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {attendance.length > 0 && currentStreak < 3 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Keep up the great work!</h3>
                <p className="text-sm text-muted-foreground">
                  Consistency is key to achieving your fitness goals. Try to visit the gym at least 3-4 times per week for best results.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
