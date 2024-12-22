import {Expose, Type} from "class-transformer";
import {IsArray, IsNumber, IsOptional, IsString} from "class-validator";

export class SyncDto {
    @Expose({
        name: 'last_sync_time'
    })
    lastSyncTime: String;
    @Expose({
        name: 'local_days'
    })
    @Type(() => DayPayload)
    @IsArray()
    localDays: Array<DayPayload>
}

export class DayPayload {
    date: String;
    @Expose({
        name: 'cycle_id'
    })
    cycleId: String;
    @Expose({
        name: 'day_category'
    })
    dayCategory: String;
    @IsOptional()
    @IsNumber()
    hydration: Number
    @Expose({
        name: 'sleep_hours'
    })
    @IsOptional()
    @IsNumber()
    sleepHours: Number
    @Expose({
        name: 'last_modified_at'
    })
    lastModifiedAt: String;
    @IsArray()
    @Type(() => NotePayload)
    notes: Array<NotePayload>
}

export class NotePayload {
    @IsString()
    name: String;
    @IsString()
    category: String;
}