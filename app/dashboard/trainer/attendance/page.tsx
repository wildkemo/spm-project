"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CalendarCheck, Users, TrendingUp, X, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface AttendanceRecord {
  id: string;
  date: string;
  member: {
    firstName: string;
    lastName: string;
  };
}

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function TrainerAttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchAttendance = async () => {
    try {
      const response = await fetch('/api/attendance/recent');
      if (!response.ok) throw new Error('Failed to fetch attendance');
      const data = await response.json();
      setAttendance(data);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members/active');
      if (!response.ok) throw new Error('Failed to fetch members');
      const data = await response.json();
      setMembers(data);
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setSearchTerm("");
    setSuccessMessage("");
    fetchMembers();
  };

  const handleCheckIn = async (memberId: string) => {
    setSubmitting(true);
    setSuccessMessage("");
    
    try {
      const response = await fetch('/api/attendance/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to check in');
      }

      setSuccessMessage(`✓ ${data.attendance.member.firstName} ${data.attendance.member.lastName} checked in successfully!`);
      
      // Refresh attendance list
      await fetchAttendance();
      
      // Close modal after 1.5 seconds
      setTimeout(() => {
        setShowModal(false);
        setSuccessMessage("");
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Error checking in member');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-64 text-red-600">{error}</div>;
  }

  const now = new Date();
  const today = attendance.filter(a => {
    const date = new Date(a.date);
    return date.toDateString() === now.toDateString();
  });

  const thisWeek = attendance.filter(a => {
    const date = new Date(a.date);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return date >= weekAgo;
  });

  const filteredMembers = members.filter(member =>
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Attendance Tracking</h2>
          <p className="text-muted-foreground">Monitor member check-ins and gym traffic.</p>
        </div>
        <Button onClick={handleOpenModal} className="gap-2">
          <CalendarCheck className="h-4 w-4" />
          Take Attendance
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{today.length}</div>
            <p className="text-xs text-muted-foreground">check-ins today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisWeek.length}</div>
            <p className="text-xs text-muted-foreground">total check-ins</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">All Time</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendance.length}</div>
            <p className="text-xs text-muted-foreground">total records</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Check-ins */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          {attendance.length > 0 ? (
            <div className="space-y-2">
              {attendance.slice(0, 20).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CalendarCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {record.member.firstName} {record.member.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(record.date).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No attendance records</h3>
              <p className="text-sm text-muted-foreground">
                Member check-ins will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Take Attendance Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between border-b">
              <CardTitle>Take Attendance</CardTitle>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-muted rounded">
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent className="pt-6 flex-1 overflow-y-auto">
              {successMessage ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
                  <p className="text-lg font-semibold text-green-600">{successMessage}</p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Search members by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-2">
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <p className="font-medium">
                              {member.firstName} {member.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                          <Button
                            onClick={() => handleCheckIn(member.id)}
                            disabled={submitting}
                            size="sm"
                            className="gap-2"
                          >
                            <CalendarCheck className="h-4 w-4" />
                            Check In
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        {searchTerm ? 'No members found' : 'Loading members...'}
                      </p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
