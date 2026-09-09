import type { Request, Response } from "express";
import { deleteHeartbeatJob } from "./_core/heartbeat";
import { sdk } from "./_core/sdk";
import * as db from "./db";

export async function handleScheduledBlogPublishing(req: Request, res: Response) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) return res.status(403).json({ error: "cron-only" });
    const schedule = await db.getScheduledBlogPublicationByTaskUid(user.taskUid);
    if (!schedule) return res.json({ ok: true, skipped: "orphan" });
    const result = await db.publishScheduledBlogPublication(schedule.id);
    if (result.published && result.taskUid) {
      try { await deleteHeartbeatJob(result.taskUid, ""); } catch (error) { console.warn("[Scheduled Blog] Published but could not remove completed schedule", error); }
    }
    return res.json({ ok: true, ...result });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : "Scheduled Blog publication failed.", timestamp: new Date().toISOString() });
  }
}
