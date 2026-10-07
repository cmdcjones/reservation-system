import { ReservationStatus, type Reservation, type TxOrDb } from "../db";

const reservationColumns = [
    "id",
    "status",
    "user_id",
    "ticket_type_id",
    "expires_at",
] as const;

export type ReservationRow = Pick<
    Reservation,
    (typeof reservationColumns)[number]
>;

export const reservationRepository = {
    async findById(
        id: number,
        executor: TxOrDb,
    ): Promise<ReservationRow | undefined> {
        return await executor
            .selectFrom("reservation")
            .where("id", "=", id)
            .select(reservationColumns)
            .executeTakeFirst();
    },

    async insertOne(
        quantity: number,
        user_id: number,
        ticket_type_id: number,
        executor: TxOrDb,
    ): Promise<ReservationRow> {
        return await executor
            .insertInto("reservation")
            .values({
                quantity,
                user_id,
                ticket_type_id,
                status: ReservationStatus.HOLD,
            })
            .returning(reservationColumns)
            .executeTakeFirstOrThrow();
    },

    async updateStatusById(
        id: number,
        status: ReservationStatus,
        executor: TxOrDb,
    ): Promise<ReservationRow> {
        return await executor
            .updateTable("reservation")
            .set({ status })
            .where("id", "=", id)
            .returning(reservationColumns)
            .executeTakeFirstOrThrow();
    },

    async _deleteReservation() {},
};
