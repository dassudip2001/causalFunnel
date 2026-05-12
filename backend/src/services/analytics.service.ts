import { prisma } from "../lib/prisma";
import type { EventWrite } from "../schema/analytics.schema";

// create
export async function createEvent(data: EventWrite) {
  try {
    const event = await prisma.event.create({
      data: {
        sessionId: data.sessionId,
        eventType: data.eventType,
        pageUrl: data.pageUrl,
        timestamp: data.timestamp,
        clickX: data.clickX,
        clickY: data.clickY,
      },
    });
    return event;
  } catch (err) {
    console.error("Error creating event:", err);
    throw err;
  }
}
// GET by sessionId
export async function getEventsBySessionId(sessionId: string) {
  try {
    const event = await prisma.event.findMany({
      where: { sessionId: sessionId },
    });
    return event;
  } catch (err) {
    console.error("Error fetching events by sessionId:", err);
    throw err;
  }
}

// GET sessions
export async function getSessions() {
  try {
    const sessions = await prisma.event.groupBy({
      by: ["sessionId", "pageUrl"],
      _count: {
        _all: true,
      },
      _max: {
        timestamp: true,
      },

      orderBy: {
        _max: {
          timestamp: "desc",
        },
      },
    });

    const formattedSessions = sessions.map((session) => ({
      _id: session.sessionId,
      pageUrl: session.pageUrl,
      totalEvents: session._count._all,
      lastActivity: session._max.timestamp,
    }));

    return formattedSessions;
  } catch (err) {
    console.log("Somthing went wrong", err);
    throw err;
  }
}

// GET hit count by pageUrl
export async function getHitCountByPageUrl(url: string) {
  try {
    const clicks = await prisma.event.findMany({
      where: {
        eventType: "click",
        pageUrl: url,
      },
    });
    return clicks;
  } catch (err) {
    console.log("");
    return err;
  }
}
