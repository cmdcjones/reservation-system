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
        ): Promise<ReservationRow> {
            return await withTransaction(executor, async () => {
                try {
                    const ticketTypeInventory =
                        await ticketTypeInventoryRepository.updateReservedByTicketTypeId(
                            ticket_type_id,
                            quantity,
                            executor,
                        );

                    if (!ticketTypeInventory) {
                        throw new Error("Ticket type sold out");
                    }

                    return await reservationRepository.insertOne(
                        quantity,
                        user_id,
                        ticket_type_id,
                        executor,
                    );
                } catch (error) {
                    throw error;
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
