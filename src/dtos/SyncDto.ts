import {Expose, Type} from "class-transformer";
import {IsArray, IsDateString, IsNumber, IsOptional, IsString} from "class-validator";

export class SyncDto {
    @IsDateString()
    last_sync_time: string;
    @IsArray()
    local_cycles: CyclePayload[]
}

export class CyclePayload {
    cycle_id: string;
    global_id?: string;
    start_date: string;
    end_date: string;
    last_modified_at: string;
    days: DayPayload[]
}

export class DayPayload {
    cycle_id: string;
    date: string;
    day_category: string;
    @IsOptional()
    @IsNumber()
    hydration: Number
    @IsOptional()
    @IsNumber()
    sleep_hours: Number
    last_modified_at: string;
    @IsArray()
    notes: NotePayload[]
}

export class NotePayload {
    @IsString()
    name: string;
    @IsString()
    category: string;
}