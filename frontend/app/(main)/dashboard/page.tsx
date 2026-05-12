"use client";

import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, Eye, MousePointer, Clock, Users } from "lucide-react";

export default function DashboardPage() {
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const res = await api.get<any[]>("/analytics/sessions");
      return res.data;
    },
  });

  // Calculate aggregated metrics
  const stats = sessions
    ? {
        totalSessions: sessions.length,
        totalEvents: sessions.reduce((sum, s) => sum + (s.totalEvents || 0), 0),
        avgEventsPerSession:
          sessions.length > 0
            ? Math.round(
                sessions.reduce((sum, s) => sum + (s.totalEvents || 0), 0) /
                  sessions.length,
              )
            : 0,
        uniquePages: [...new Set(sessions.map((s) => s.pageUrl))].length,
      }
    : {
        totalSessions: 0,
        totalEvents: 0,
        avgEventsPerSession: 0,
        uniquePages: 0,
      };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Real-time analytics overview of user sessions and events
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sessions
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessionsLoading ? "..." : stats.totalSessions}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active tracking sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessionsLoading ? "..." : stats.totalEvents.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Events / Session
            </CardTitle>
            <Eye className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessionsLoading ? "..." : stats.avgEventsPerSession}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per session average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Pages</CardTitle>
            <MousePointer className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessionsLoading ? "..." : stats.uniquePages}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Pages being tracked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
          <CardDescription>
            Latest {Math.min(sessions?.length || 0, 5)} sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessionsLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : sessions && sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.slice(0, 5).map((session, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {session.pageUrl || "Unknown"}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(session.lastActivity).toLocaleTimeString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        {session.totalEvents} events
                      </span>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-gray-500">
                    ID: {session._id?.substring(0, 8)}...
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No sessions yet</p>
              <p className="text-sm text-muted-foreground">
                Sessions will appear here when users interact with your tracking
                script
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Quick Stats
            </CardTitle>
            <CardDescription>High-level analytics summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">
                Active Today
              </span>
              <span className="font-semibold">
                {sessionsLoading ? "..." : stats.totalSessions}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">
                Avg Session Duration
              </span>
              <span className="font-semibold">—</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Top Page</span>
              <span className="font-semibold text-xs">
                {sessions && sessions.length > 0
                  ? sessions[0].pageUrl?.substring(0, 20) + "..."
                  : "—"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointer className="h-5 w-5" />
              Engagement
            </CardTitle>
            <CardDescription>User interaction metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">
                Total Events
              </span>
              <span className="font-semibold">
                {sessionsLoading ? "..." : stats.totalEvents}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">
                Avg Events/Session
              </span>
              <span className="font-semibold">
                {sessionsLoading ? "..." : stats.avgEventsPerSession}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">
                Pages Tracked
              </span>
              <span className="font-semibold">
                {sessionsLoading ? "..." : stats.uniquePages}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
