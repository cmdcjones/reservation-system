import express, { type Request, type Response } from "express";

const PORT = 3000;
const app = express();

app.get("/health", async (_: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.get("/events", async (_: Request, res: Response) => {
  res.json({ events: [] });
});

app.get("/events/:eventId", async (req: Request, res: Response) => {
  const { eventId } = req.params;
  res.json({ event: {} });
});

app.listen(3000, () => {
  console.log(`Server listening on port: ${PORT}`);
});
