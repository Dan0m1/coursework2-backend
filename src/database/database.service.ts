import {Injectable, OnModuleDestroy, OnModuleInit} from "@nestjs/common";
import * as sql from 'mssql'
import * as process from "node:process";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private pool: sql.ConnectionPool;

    async onModuleInit() {
        this.pool = await new sql.ConnectionPool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            server: process.env.DB_SERVER,
            database: process.env.DB_NAME,
            port: 1433,
            options: {
                encrypt: true,
                trustServerCertificate: true
            }
        }).connect()
    }

    async onModuleDestroy() {
        await this.pool.close();
    }

    getPool() {
        return this.pool;
    }
}