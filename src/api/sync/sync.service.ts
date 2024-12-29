import {Injectable} from "@nestjs/common";
import {SyncDto} from "../../dtos/SyncDto";
import {SyncRepository} from "../../database/repositories/sync.repository";

@Injectable()
export class SyncService {
    constructor(
        private readonly syncRepository: SyncRepository,
    ) {}

    async syncData(syncDto: SyncDto, userId: number) {
        const { last_sync_time, local_cycles } = syncDto;

        // Обробка циклів
        for (const cycle of local_cycles) {
            console.log(cycle)

            await this.syncRepository.mergeCycle(cycle, userId);

            console.log("Here 1")

            // Обробка днів у циклі
            // for (const day of cycle.days) {
            //     if()
            //     await this.syncRepository.mergeDay(day);
            //     console.log("Here 2")
            //
            //     // Обробка приміток
            //     for (const note of day.notes) {
            //         const formattedDate = new Date(day.date).toISOString().split('T')[0];
            //         await this.syncRepository.insertNoteForDay(formattedDate, note);
            //     }
            //     console.log("Here 3")
            // }
        }

        // Отримання оновлених даних
        const updatedCycles = await this.syncRepository.getUpdatedCycles(last_sync_time);
        console.log("Here 4")

        console.log(updatedCycles.recordset)

        // Формування оновлених циклів
        const updatedCyclesPayload = await Promise.all(
            updatedCycles.recordset.map(async (cycle) => {
                console.log(cycle)
                console.log("found", syncDto.local_cycles.find((value) => value.last_modified_at === cycle.last_modified_at)[0]?.cycle_id)
                return {
                    id: syncDto.local_cycles.find((value) => value.last_modified_at === cycle.last_modified_at)[0]?.cycle_id || null,
                    global_id: cycle.id || null,
                    status: "ACTIVE",
                    start_date: cycle.start_date,
                    end_date: cycle.end_date,
                    last_modified_at: cycle.last_modified_at,
                };
            })
        );

        // Формування відповіді
        console.log(updatedCyclesPayload)
        return {
            updated_cycles: updatedCyclesPayload,
        };
    }

    async resolveDayCategory() {

    }
}