import {Global, Module} from "@nestjs/common";
import {DatabaseService} from "./database.service";
import {UserRepository} from "./repositories/user.repository";

@Global()
@Module({
    providers: [DatabaseService, UserRepository],
    exports: [DatabaseService, UserRepository],
})
export class DatabaseModule {}