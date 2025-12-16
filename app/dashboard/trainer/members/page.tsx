"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Users, Mail, Phone, Calendar, Award, ChevronDown, ChevronUp, Filter, CalendarCheck, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  status: string;
  joinDate: string;
  membershipEnd: string;
  plan: {
    name: string;
    price: number;
    duration: number;
  } | null;
  attendance: Array<{ id: string; date: string }>;
}

export default function TrainerMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "expiring" | "expired">("all");
  const [sortBy, setSortBy] = useState<"name" | "expiry" | "plan">("name");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('/api/members/active');
        
        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }

        const data = await response.json();
        setMembers(data);
      } catch (err) {
        console.error('Error fetching members:', err);
        setError('Failed to load members');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-64 text-red-600">{error}</div>;
  }

  const daysUntilExpiry = (membershipEnd: string) => {
    return Math.ceil((new Date(membershipEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  };

  const getMemberStatus = (membershipEnd: string) => {
    const days = daysUntilExpiry(membershipEnd);
    if (days <= 0) return "expired";
    if (days <= 7) return "expiring";
    return "active";
  };

  const filteredMembers = members
    .filter(member => {
      const matchesSearch = `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterStatus === "all") return matchesSearch;
      return matchesSearch && getMemberStatus(member.membershipEnd) === filterStatus;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      } else if (sortBy === "expiry") {
        return new Date(a.membershipEnd).getTime() - new Date(b.membershipEnd).getTime();
      } else {
        return (b.plan?.price || 0) - (a.plan?.price || 0);
      }
    });

  const expiringCount = members.filter(m => getMemberStatus(m.membershipEnd) === "expiring").length;
  const premiumCount = members.filter(m => m.plan && (m.plan.name.includes('Premium') || m.plan.name.includes('Gold'))).length;

  const toggleExpand = (memberId: string) => {
    setExpandedMember(expandedMember === memberId ? null : memberId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Members</h2>
        <p className="text-muted-foreground">View and manage gym members.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setFilterStatus("all")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
            <p className="text-xs text-muted-foreground">active members</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setFilterStatus("expiring")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{expiringCount}</div>
            <p className="text-xs text-muted-foreground">within 7 days</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Members</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{premiumCount}</div>
            <p className="text-xs text-muted-foreground">premium plans</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <CardTitle>Member List ({filteredMembers.length})</CardTitle>
            <div className="flex flex-wrap gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="name">Sort by Name</option>
                <option value="expiry">Sort by Expiry</option>
                <option value="plan">Sort by Plan Price</option>
              </select>
              
              <div className="flex gap-1 border rounded-lg p-1">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    filterStatus === "all" ? "bg-primary text-white" : "hover:bg-muted"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus("active")}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    filterStatus === "active" ? "bg-green-600 text-white" : "hover:bg-muted"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilterStatus("expiring")}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    filterStatus === "expiring" ? "bg-yellow-600 text-white" : "hover:bg-muted"
                  }`}
                >
                  Expiring
                </button>
                <button
                  onClick={() => setFilterStatus("expired")}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    filterStatus === "expired" ? "bg-red-600 text-white" : "hover:bg-muted"
                  }`}
                >
                  Expired
                </button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-3">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => {
                const daysLeft = daysUntilExpiry(member.membershipEnd);
                const status = getMemberStatus(member.membershipEnd);
                const isExpanded = expandedMember === member.id;
                const thisMonthAttendance = member.attendance?.filter(a => {
                  const date = new Date(a.date);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).length || 0;

                return (
                  <div 
                    key={member.id} 
                    className={`border rounded-lg transition-all ${
                      isExpanded ? 'shadow-lg' : 'hover:shadow-md'
                    }`}
                  >
                    <div 
                      className="p-4 cursor-pointer"
                      onClick={() => toggleExpand(member.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">
                              {member.firstName} {member.lastName}
                            </h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              status === 'expired' ? 'bg-red-100 text-red-700' :
                              status === 'expiring' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {status === 'expired' ? 'Expired' : status === 'expiring' ? 'Expiring Soon' : 'Active'}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span>{member.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Award className="h-3 w-3" />
                              <span className="font-medium">{member.plan?.name || 'No Plan'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CalendarCheck className="h-3 w-3" />
                              <span>{thisMonthAttendance} visits this month</span>
                            </div>
                          </div>
                        </div>
                        
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t pt-4 bg-muted/30">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm">Contact Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{member.email}</span>
                              </div>
                              {member.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span>{member.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm">Membership Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Plan:</span>
                                <span className="font-medium">{member.plan?.name || 'No Plan'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Price:</span>
                                <span className="font-medium">${member.plan?.price || 0}/month</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Duration:</span>
                                <span className="font-medium">{member.plan?.duration || 0} months</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Joined:</span>
                                <span className="font-medium">{new Date(member.joinDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Expires:</span>
                                <span className={`font-medium ${daysLeft <= 7 ? 'text-yellow-600' : ''}`}>
                                  {new Date(member.membershipEnd).toLocaleDateString()}
                                  {daysLeft > 0 && ` (${daysLeft} days)`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">
                                Total Visits: {member.attendance?.length || 0}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                              <Button size="sm">
                                <CalendarCheck className="h-4 w-4 mr-1" />
                                Check In
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-center text-muted-foreground py-8">No members found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
