import { db, ReservationStatus, withTransaction, type TxOrDb } from "../db";
import {
    reservationRepository,
    type ReservationRow,
} from "../repositories/reservation";
import { ticketTypeInventoryRepository } from "../repositories/ticket_type_inventory";

export function createReservationService(executor: TxOrDb = db) {
    return {
        async findById(id: number): Promise<ReservationRow> {
            try {
                const reservation = await reservationRepository.findById(
                    id,
                    executor,
                );
                if (!reservation) {
                    throw new Error("Reservation not found");
                }

                return reservation;
            } catch (error) {
                throw new Error("Internal error");
            }
        },
        async create(
            quantity: number,
            user_id: number,
            ticket_type_id: number,
        ): Promise<ReservationRow | undefined> {
            return await withTransaction(executor, async () => {
                try {
                    await ticketTypeInventoryRepository.updateReservedByTicketTypeId(
                        ticket_type_id,
                        quantity,
                        executor,
                    );

                    return await reservationRepository.insertOne(
                        quantity,
                        user_id,
                        ticket_type_id,
                        executor,
                    );
                } catch (error: any) {
                    if (error.constraint === "ticket_type_inventory_check") {
                      throw new Error("Ticket inventory sold out");
                    }
                    throw error
                }
            });
        },
        async confirm(id: number) {
            try {
                return await reservationRepository.updateStatusById(
                    id,
                    ReservationStatus.CONFIRMED,
                    executor,
                );
            } catch (error) {
                throw new Error(`Failed to confirm reservation`);
            }
        },
    };
}
