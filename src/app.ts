import express, { type Request, type Response } from "express";
import { eventService } from "./services";

export const app = express();

app.get("/health", async (_: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.get("/events", async (_: Request, res: Response) => {
  res.json({ events: [] });
});

interface GetEventParams {
  eventId: string;
}

app.get(
  "/events/:eventId",
  async (req: Request<GetEventParams>, res: Response) => {
    const eventId = req.params["eventId"];

    const id = parseInt(eventId);

    if (isNaN(id)) {
      throw new Error("Invalid ID");
    }
    const event = await eventService.findById(id);
    res.json({
      event,
    });
  },
);
