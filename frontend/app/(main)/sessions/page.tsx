"use client";

import api from "@/lib/axios";
import { EventRead } from "@/schema/analytics.schema";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, MousePointer, Eye } from "lucide-react";

export default function SessionsPage() {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );

  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const res = await api.get<any[]>("/analytics/sessions");
      return res.data;
    },
  });

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["events", selectedSessionId],
    queryFn: async () => {
      if (!selectedSessionId) return [];
      const res = await api.get<EventRead[]>(
        `/analytics/session/${selectedSessionId}`,
      );
      return res.data;
    },
    enabled: !!selectedSessionId,
  });

  const eventStats = events
    ? {
        clicks: events.filter((e) => e.eventType === "click").length,
        pageviews: events.filter((e) => e.eventType === "page_view").length,
        avgClickX:
          events
            .filter((e) => e.eventType === "click")
            .reduce((acc, e) => acc + (e.clickX || 0), 0) /
          (events.filter((e) => e.eventType === "click").length || 1),
        avgClickY:
          events
            .filter((e) => e.eventType === "click")
            .reduce((acc, e) => acc + (e.clickY || 0), 0) /
          (events.filter((e) => e.eventType === "click").length || 1),
      }
    : { clicks: 0, pageviews: 0, avgClickX: 0, avgClickY: 0 };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">
          Track user sessions and events across your application
        </p>
      </div>

      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="events" disabled={!selectedSessionId}>
            Events {selectedSessionId && `(${events?.length || 0})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                {sessions?.length || 0} total sessions recorded
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
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Session ID</TableHead>
                        <TableHead>Page Url</TableHead>
                        <TableHead>Total Events</TableHead>
                        <TableHead>Last Activity</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sessions.map((session) => (
                        <TableRow
                          key={session._id}
                          onClick={() => setSelectedSessionId(session._id)}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-medium">
                            {session._id?.substring(0, 12)}...
                          </TableCell>
                          <TableCell>{session.pageUrl}</TableCell>
                          <TableCell>{session.totalEvents || 0}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {session.lastActivity
                              ? new Date(session.lastActivity).toLocaleString()
                              : "—"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                selectedSessionId === session._id
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {selectedSessionId === session._id
                                ? "Selected"
                                : "Active"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-muted-foreground">No sessions found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          {selectedSessionId && (
            <>
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Events
                    </CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {events?.length || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Pageviews
                    </CardTitle>
                    <Eye className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {eventStats.pageviews}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Clicks
                    </CardTitle>
                    <MousePointer className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {eventStats.clicks}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Avg Click Position
                    </CardTitle>
                    <MousePointer className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs font-medium text-muted-foreground">
                      X: {Math.round(eventStats.avgClickX)} Y:{" "}
                      {Math.round(eventStats.avgClickY)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>User Journey Timeline</CardTitle>
                  <CardDescription>
                    Events in chronological order
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {eventsLoading ? (
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : events && events.length > 0 ? (
                    <div className="space-y-4">
                      {events.map((event, index) => (
                        <div
                          key={index}
                          className="flex gap-4 pb-4 border-b last:border-0 last:pb-0"
                        >
                          <div className="flex flex-col items-center">
                            <div className="rounded-full bg-muted p-2">
                              {event.eventType === "click" ? (
                                <MousePointer className="h-4 w-4 text-orange-500" />
                              ) : (
                                <Eye className="h-4 w-4 text-blue-500" />
                              )}
                            </div>
                            {index < (events?.length || 0) - 1 && (
                              <div className="w-0.5 h-12 bg-muted mt-2" />
                            )}
                          </div>
                          <div className="flex-1 pt-1">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline">{event.eventType}</Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(event.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm font-medium mt-2">
                              {event.pageUrl}
                            </p>
                            {event.eventType === "click" && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Clicked at: ({event.clickX}, {event.clickY})
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <p className="text-muted-foreground">No events found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
