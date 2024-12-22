import {UserModule} from "./user/user.module";
import {Module} from "@nestjs/common";
import {AuthModule} from "./auth/auth.module";
import {SyncModule} from "./sync/sync.module";


@Module({
    imports: [
        UserModule,
        AuthModule,
        SyncModule
    ],
})
export class ApiModule {}