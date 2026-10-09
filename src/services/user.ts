import { TxOrDb } from "../db";
import { userRespository, UserRow } from "../repositories/user";

export function createUserService(executor: TxOrDb) {
    return {
        async create(first_name: string, last_name: string, email: string): Promise<UserRow> {
            try {
              return await userRespository.insertOne(first_name, last_name, email, executor)
            } catch (error) {
                throw new Error(`Error creating user: ${error}`)
            }
        },
    };
}
