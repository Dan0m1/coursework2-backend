import {Injectable} from "@nestjs/common";

@Injectable()
export class SyncService {
    async sync() {
        return 'Synced';
    }
}