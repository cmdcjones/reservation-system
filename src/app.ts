import express, { type Request, type Response } from "express";
import { createEventService, createReservationService } from "./services";
import type { ReservationRow } from "./repositories/reservation";
import type { TxOrDb } from "./db";

export interface CreateReservationInput {
    user_id: number;
    ticket_type_id: number;
    quantity: number;
}

interface GetEventParams {
    eventId: string;
}

export const app = express();
export function createApp(executor?: TxOrDb) {
    app.use(express.json());

    app.get("/health", async (_: Request, res: Response) => {
        res.json({ status: "ok" });
    });

    app.get("/events", async (_: Request, res: Response) => {
        res.json({ events: [] });
    });

    app.get(
        "/events/:eventId",
        async (req: Request<GetEventParams>, res: Response) => {
            const eventId = req.params["eventId"];

            const id = parseInt(eventId);

            if (isNaN(id)) {
                throw new Error("Invalid ID");
            }
            const event = await createEventService(executor).findById(id);
            res.json({
                event,
            });
        },
    );

    app.post(
        "/reservations",
        async (
            req: Request<CreateReservationInput>,
            res: Response<ReservationRow> | any,
        ) => {
            try {
                const { user_id, ticket_type_id, quantity } = req.body;
                const reservation = await createReservationService(executor).create(
                    quantity,
                    user_id,
                    ticket_type_id,
                );
                res.json(reservation);
            } catch (error: any) {
                res.json({ error: error.message })
            }
        },
    );

    return app;
}
