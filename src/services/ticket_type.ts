import { db, withTransaction, type TxOrDb } from "../db";
import {
    ticketTypeRepository,
    type TicketTypeRow,
} from "../repositories/ticket_type";
import { ticketTypeInventoryRepository } from "../repositories/ticket_type_inventory";

export function createTicketTypeService(executor: TxOrDb = db) {
    return {
        async createWithTicketTypeInventory(
            event_id: number,
            name: string,
            ticketCapacity: number,
        ): Promise<TicketTypeRow> {
            return await withTransaction(executor, async () => {
                try {
                    const ticketType = await ticketTypeRepository.insertOne(
                        event_id,
                        name,
                        executor,
                    );

                    await ticketTypeInventoryRepository.insertOne(
                        ticketType.id,
                        ticketCapacity,
                        executor,
                    );

                    return ticketType;
                } catch (error: any) {
                    throw new Error(
                        `Failed to create ticket type with inventory: ${error}`,
                    );
                }
            });
        },
    };
}
