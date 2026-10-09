import { TxOrDb, User } from "../db"

const userColumns = ["id", "first_name", "last_name", "email"] as const

export type UserRow = Pick<User, (typeof userColumns)[number]>;

export const userRespository = {
    async findUserById(
        id: number,
        executor: TxOrDb,
    ): Promise<UserRow | undefined> {
      return await executor.selectFrom("user").where("id", "=", id).select(userColumns).executeTakeFirst()
    },

    async insertOne(first_name: string, last_name: string, email: string, executor: TxOrDb): Promise<UserRow> {
        return await executor.insertInto("user").values({ first_name, last_name, email }).returning(userColumns).executeTakeFirstOrThrow()
    }
}
