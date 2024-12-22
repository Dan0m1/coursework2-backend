import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {DatabaseService} from "../database.service";

@Injectable()
export class UserRepository {
    constructor(
        private readonly databaseService: DatabaseService
    ) {}

    async findById(id: bigint) {
        const pool = this.databaseService.getPool()
        const result = await pool.request()
            .input('id', id)
            .query('SELECT * FROM Users WHERE id = @id')
        return result.recordset[0]
    }

    async findByProviderId(providerId: String) {
        const pool = this.databaseService.getPool()
        const result = await pool.request()
            .input('providerId', providerId)
            .query('SELECT * FROM Users WHERE provider_id = @providerId')
        return result.recordset[0]
    }

    async findByEmail(email: string) {
        const pool = this.databaseService.getPool()
        const result = await pool.request()
            .input('email', email)
            .query('SELECT DISTINCT * FROM Users WHERE email = @email')
        return result.recordset[0]
    }

    async create(user: {providerId: string, email: string, name: string}) {
        if (!user.providerId|| !user.email || !user.name) {
            throw new InternalServerErrorException('Invalid user data')
        }

        const pool = this.databaseService.getPool()
        await pool.request()
            .input('providerId', user.providerId)
            .input('email', user.email)
            .input('name', user.name)
            .query('INSERT INTO Users (provider_id, email, name) VALUES (@providerId, @email, @name)')
        const newUser = await pool.request()
            .input('providerId', user.providerId)
            .query('SELECT DISTINCT * FROM Users WHERE provider_id = @providerId')
        return newUser.recordset[0]
    }
}