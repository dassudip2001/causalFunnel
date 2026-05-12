import type { Request, Response } from "express";
import { EventWriteSchema } from "../schema/analytics.schema";
import {
  createEvent,
  getEventsBySessionId,
  getHitCountByPageUrl,
  getSessions,
} from "../services/analytics.service";
export async function create(req: Request, res: Response) {
  try {
    const validate = EventWriteSchema.safeParse(req.body);
    if (!validate.success) {
      res.status(400).json({
        error: "Invalid request data",
        fields: validate.error?.issues?.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
      return;
    }
    const event = await createEvent(validate.data);
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getBySessionId(req: Request, res: Response) {
  try {
    const sessionId = req.params.sessionId;
    if (!sessionId) {
      res.status(400).json({ error: "Missing sessionId parameter" });
      return;
    }
    const events = await getEventsBySessionId(sessionId as string);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getClick(req: Request, res: Response) {
  try {
    const pageUrl = req.query.pageUrl as string;
    if (!pageUrl) {
      res.status(400).json({ error: "Missing pageUrl query parameter" });
      return;
    }
    const hitCount = await getHitCountByPageUrl(pageUrl);
    res.json({ pageUrl, hitCount });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function get(req: Request, res: Response) {
  try {
    const sessions = await getSessions();
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}
