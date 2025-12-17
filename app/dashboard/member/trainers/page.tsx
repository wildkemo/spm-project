"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Users, UserPlus, UserMinus, Mail, Award, CheckCircle2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface Trainer {
  id: string;
  name: string;
  email: string;
  specialization: string | null;
  isSubscribed: boolean;
  subscriptionId: string | null;
}

export default function MemberTrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const user = localStorage.getItem('user');
      if (!user) {
        setError('No user data found');
        setLoading(false);
        return;
      }

      const userData = JSON.parse(user);
      const response = await fetch(`/api/member/trainers?memberId=${userData.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch trainers');
      }

      const data = await response.json();
      setTrainers(data);
    } catch (err) {
      console.error('Error fetching trainers:', err);
      setError('Failed to load trainers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (trainerId: string) => {
    const user = localStorage.getItem('user');
    if (!user) return;

    const userData = JSON.parse(user);
    setActionLoading(trainerId);

    try {
      const response = await fetch('/api/member/trainers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: userData.id,
          trainerId,
          action: 'subscribe',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe to trainer');
      }

      // Refresh trainers list
      await fetchTrainers();
    } catch (err) {
      console.error('Error subscribing to trainer:', err);
      alert('Failed to subscribe to trainer. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnsubscribe = async (trainerId: string) => {
    const user = localStorage.getItem('user');
    if (!user) return;

    const confirmed = window.confirm(
      'Are you sure you want to unsubscribe from this trainer?'
    );

    if (!confirmed) return;

    const userData = JSON.parse(user);
    setActionLoading(trainerId);

    try {
      const response = await fetch('/api/member/trainers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: userData.id,
          trainerId,
          action: 'unsubscribe',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to unsubscribe from trainer');
      }

      // Refresh trainers list
      await fetchTrainers();
    } catch (err) {
      console.error('Error unsubscribing from trainer:', err);
      alert('Failed to unsubscribe from trainer. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center justify-center h-64 text-red-600">{error}</div>;
  }

  const subscribedTrainers = trainers.filter(t => t.isSubscribed);
  const availableTrainers = trainers.filter(t => !t.isSubscribed);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          My Trainers
        </h2>
        <p className="text-muted-foreground">Manage your trainer subscriptions and discover new trainers.</p>
      </div>

      {/* Stats Card */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscribed Trainers</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{subscribedTrainers.length}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Trainers</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{availableTrainers.length}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trainers</CardTitle>
            <Sparkles className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{trainers.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Subscribed Trainers Section */}
      {subscribedTrainers.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Your Trainers
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {subscribedTrainers.map((trainer) => (
              <Card key={trainer.id} className="hover:shadow-lg transition-all duration-300 border-2 border-green-500">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-500 rounded-full">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{trainer.name}</CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600 font-semibold">Subscribed</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{trainer.email}</span>
                  </div>
                  {trainer.specialization && (
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="font-medium">{trainer.specialization}</span>
                    </div>
                  )}
                  <button
                    onClick={() => handleUnsubscribe(trainer.id)}
                    disabled={actionLoading === trainer.id}
                    className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <UserMinus className="h-4 w-4" />
                    {actionLoading === trainer.id ? 'Processing...' : 'Unsubscribe'}
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Trainers Section */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          {subscribedTrainers.length > 0 ? 'Discover More Trainers' : 'Available Trainers'}
        </h3>
        
        {availableTrainers.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableTrainers.map((trainer) => (
              <Card key={trainer.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{trainer.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{trainer.email}</span>
                  </div>
                  {trainer.specialization && (
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="font-medium">{trainer.specialization}</span>
                    </div>
                  )}
                  <button
                    onClick={() => handleSubscribe(trainer.id)}
                    disabled={actionLoading === trainer.id}
                    className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    {actionLoading === trainer.id ? 'Processing...' : 'Subscribe'}
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                {subscribedTrainers.length > 0 
                  ? "You're subscribed to all available trainers!" 
                  : "No trainers available at the moment."}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {subscribedTrainers.length > 0 
                  ? "Check back later for new trainers." 
                  : "Please contact the front desk for assistance."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
