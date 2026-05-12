import { z } from "zod";

// Enum for EventType
export const EventTypeSchema = z.enum(["click", "page_view"]);

// Schema for Event model
export const EventWriteSchema = z.object({
  sessionId: z.string(),
  eventType: EventTypeSchema,
  pageUrl: z.string(),
  timestamp: z.string(),
  clickX: z.number().int().optional(),
  clickY: z.number().int().optional(),
});

export const EventReadSchema = EventWriteSchema.extend({
  _id: z.string(),
  pageUrl:z.string().optional(),
  totalEvents: z.number().int().optional(),
});

// Type inference from schema
export type EventType = z.infer<typeof EventTypeSchema>;
export type EventWrite = z.infer<typeof EventWriteSchema>;
export type EventRead = z.infer<typeof EventReadSchema>;
