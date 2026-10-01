import express, { type Request, type Response } from "express";

export const app = express();

app.get("/health", async (_: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.get("/events", async (_: Request, res: Response) => {
  res.json({ events: [] });
});

app.get("/events/:eventId", async (req: Request, res: Response) => {
  const { eventId } = req.params;
  res.json({
    event: {
      id: eventId,
    },
  });
});
