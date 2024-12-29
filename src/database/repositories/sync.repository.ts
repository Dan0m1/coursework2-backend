import {Injectable} from "@nestjs/common";
import {DatabaseService} from "../database.service";
import {CyclePayload} from "../../dtos/SyncDto";

@Injectable()
export class SyncRepository {
    constructor(
        private readonly databaseService: DatabaseService
    ) {}

    async mergeCycle(cycle: CyclePayload, userId: number) {
        const pool = this.databaseService.getPool()
        const request = pool.request();

        const startDate = new Date(cycle.start_date).toISOString().split('T')[0];
        const endDate = new Date(cycle.end_date).toISOString().split('T')[0];
        const modifiedAt = new Date(cycle.last_modified_at).toISOString()
        const periodEndDate = new Date(cycle.days.filter((value) => value.day_category === "CONFIRMED_PERIOD").at(-1)?.date).toISOString().split('T')[0];

        return request
            .input('cycle_id', cycle.global_id)
            .input('user_id', userId)
            .input('start_date',startDate)
            .input('end_date', endDate)
            .input('last_modified_at', modifiedAt)
            .input('period_end_date', periodEndDate)
            .query(`
                MERGE Cycles AS target
                USING (SELECT @cycle_id AS cycle_id) AS source
                ON target.id = source.cycle_id
                WHEN MATCHED THEN
                    UPDATE SET start_date = @start_date, 
                               end_date = @end_date, 
                               last_modified_at = @last_modified_at
                WHEN NOT MATCHED THEN
                    INSERT (start_date, user_id, end_date, last_modified_at, period_end_date)
                    VALUES (@start_date, @user_id, @end_date, @last_modified_at, @period_end_date);
            `);
    }

    async mergeDay(day) {
        const pool = this.databaseService.getPool()
        const request = pool.request();

        return request
            .input('cycle_id', day.cycle_id)
            .input('date', day.date)
            .input('day_category', day.day_category)
            .input('hydration', day.hydration || null)
            .input('sleep_hours', day.sleep_hours || null)
            .input('last_modified_at', day.last_modified_at)
            .query(`
                MERGE DailyLogs AS target
                USING (SELECT @cycle_id AS cycle_id, @date AS date) AS source
                ON target.cycle_id = source.cycle_id AND target.date = source.date
                WHEN MATCHED THEN
                    UPDATE SET dayCategory = @day_category, 
                               hydration = @hydration, 
                               sleep_hours = @sleep_hours, 
                               last_modified_at = @last_modified_at
                WHEN NOT MATCHED THEN
                    INSERT (cycle_id, date, hydration, sleep_hours, last_modified_at)
                    VALUES (@cycle_id, @date, @hydration, @sleep_hours, @last_modified_at);
            `);
    }

    async insertNoteForDay(dayDate, note) {
        const pool = this.databaseService.getPool()
        const request = pool.request();

        return request
            .input('daily_log_date', dayDate)
            .input('note_name', note.name)
            .input('category_name', note.category)
            .query(`
                INSERT INTO DailyNotes (daily_log_id, note_id)
                SELECT dl.id, n.id
                FROM DailyLogs dl
                JOIN Notes n ON n.name = @note_name
                WHERE dl.date = @daily_log_date
                ON DUPLICATE KEY UPDATE note_id = n.id;
            `);
    }

    async getUpdatedCycles(lastSyncTime) {
        console.log(lastSyncTime)
        const pool = this.databaseService.getPool()
        const request = pool.request();

        const time = new Date(lastSyncTime).toISOString()
        console.log(time)
        return request
            .input('last_sync_time', time)
            .query(`
                SELECT * 
                FROM Cycles
                WHERE last_modified_at > @last_sync_time;
            `);
    }

    async getUpdatedDays(lastSyncTime) {
        const pool = this.databaseService.getPool()
        const request = pool.request();

        return request
            .input('last_sync_time', lastSyncTime)
            .query(`
                SELECT * 
                FROM DailyLogs
                WHERE last_modified_at > @last_sync_time;
            `);
    }

    async getNotesForDay(dayId) {
        const pool = this.databaseService.getPool()
        const request = pool.request();

        return request
            .input('daily_log_id', dayId)
            .query(`
                SELECT n.name, nc.name AS category_name
                FROM DailyNotes dn
                JOIN Notes n ON dn.note_id = n.id
                JOIN NotesCategories nc ON n.category_id = nc.id
                WHERE dn.daily_log_id = @daily_log_id;
            `)
            .then((result) => result.recordset);
    }
}