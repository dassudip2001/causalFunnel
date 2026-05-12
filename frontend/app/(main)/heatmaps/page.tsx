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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MousePointer, Eye, MapPin } from "lucide-react";

export default function HeatmapsPage() {
  const [selectedPageUrl, setSelectedPageUrl] = useState<string>("");

  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const res = await api.get<EventRead[]>("/analytics/sessions");
      return res.data;
    },
  });

  const { data: heatmapData, isLoading: heatmapLoading } = useQuery({
    queryKey: ["heatmap", selectedPageUrl],
    queryFn: async () => {
      if (!selectedPageUrl) return null;
      const res = await api.get<{ pageUrl: string; hitCount: EventRead[] }>(
        `/analytics/heatmap?pageUrl=${encodeURIComponent(selectedPageUrl)}`,
      );
      return res.data;
    },
    enabled: !!selectedPageUrl,
  });

  // Get unique page URLs from sessions
  const uniquePageUrls = sessions
    ? [...new Set(sessions.map((s) => s.pageUrl).filter(Boolean))]
    : [];

  const clickEvents = heatmapData?.hitCount || [];
  const clickStats = {
    totalClicks: clickEvents.length,
    avgX:
      clickEvents.length > 0
        ? clickEvents.reduce((sum, e) => sum + (e.clickX || 0), 0) /
          clickEvents.length
        : 0,
    avgY:
      clickEvents.length > 0
        ? clickEvents.reduce((sum, e) => sum + (e.clickY || 0), 0) /
          clickEvents.length
        : 0,
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Heatmaps</h2>
        <p className="text-muted-foreground">
          Visualize user click patterns across your pages
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Select Page URL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedPageUrl} onValueChange={setSelectedPageUrl}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a page to analyze" />
              </SelectTrigger>
              <SelectContent>
                {sessionsLoading ? (
                  <div className="p-2">
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : uniquePageUrls.length > 0 ? (
                  uniquePageUrls.map((url) => (
                    <SelectItem key={url} value={url?.toString() || ""}>
                      {url}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground">
                    No pages found
                  </div>
                )}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {heatmapLoading ? "..." : clickStats.totalClicks}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Click Position
            </CardTitle>
            <MapPin className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xs font-medium text-muted-foreground">
              X: {clickStats.avgX.toFixed(0)} Y: {clickStats.avgY.toFixed(0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedPageUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Click Heatmap for {selectedPageUrl}
            </CardTitle>
            <CardDescription>
              Visual representation of user clicks on the page
            </CardDescription>
          </CardHeader>
          <CardContent>
            {heatmapLoading ? (
              <div className="flex items-center justify-center h-96">
                <Skeleton className="h-96 w-full" />
              </div>
            ) : clickEvents.length > 0 ? (
              <div className="relative bg-gray-50 border rounded-lg h-96 overflow-hidden">
                {/* Page representation */}
                <div className="absolute inset-4 bg-white border-2 border-dashed border-gray-300 rounded">
                  <div className="absolute top-2 left-2 text-xs text-gray-500">
                    Page: {selectedPageUrl}
                  </div>

                  {/* Click dots */}
                  {clickEvents.map((event, index) => (
                    <div
                      key={index}
                      className="absolute w-3 h-3 bg-orange-500 rounded-full opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                      style={{
                        left: `${((event.clickX || 0) / 1920) * 100}%`,
                        top: `${((event.clickY || 0) / 1080) * 100}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      title={`Click at (${event.clickX}, ${event.clickY})`}
                    >
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                        ({event.clickX}, {event.clickY})
                      </div>
                    </div>
                  ))}

                  {/* Grid overlay for reference */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={`v-${i}`}
                        className="absolute top-0 bottom-0 w-px bg-gray-200"
                        style={{ left: `${(i + 1) * 10}%` }}
                      />
                    ))}
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={`h-${i}`}
                        className="absolute left-0 right-0 h-px bg-gray-200"
                        style={{ top: `${(i + 1) * 10}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-2 right-2 bg-white p-2 rounded shadow-sm border">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>Click ({clickEvents.length})</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <MousePointer className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-muted-foreground">
                  No click data available for this page
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try selecting a different page or ensure tracking is active
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedPageUrl && clickEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Click Details</CardTitle>
            <CardDescription>
              Recent clicks with timestamps and positions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {clickEvents.slice(0, 20).map((event, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex items-center gap-2">
                    <MousePointer className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium">
                      Click at ({event.clickX}, {event.clickY})
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </Badge>
                </div>
              ))}
              {clickEvents.length > 20 && (
                <div className="text-center text-sm text-muted-foreground py-2">
                  ... and {clickEvents.length - 20} more clicks
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
