import {Global, Module} from "@nestjs/common";
import {DatabaseService} from "./database.service";
import {UserRepository} from "./repositories/user.repository";
import {SyncRepository} from "./repositories/sync.repository";

@Global()
@Module({
    providers: [DatabaseService, UserRepository, SyncRepository],
    exports: [DatabaseService, UserRepository, SyncRepository],
})
export class DatabaseModule {}