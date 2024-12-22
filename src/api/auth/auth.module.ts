import {Module} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {JwtModule} from "@nestjs/jwt";
import {AuthController} from "./auth.controller";
import {PassportModule} from "@nestjs/passport";
import {JwtStrategy} from "../../common/strategies/jwt.strategy";
import {UserModule} from "../user/user.module";
import {GoogleAuthController} from "./google/auth.google.controller";
import {GoogleAuthService} from "./google/auth.google.service";
import {GoogleOauth2Utils} from "./google/auth.google.oauth2.utils";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1d' },
        }),
        UserModule
    ],
    controllers: [
        AuthController,
        GoogleAuthController
    ],
    providers: [
        AuthService,
        JwtStrategy,
        GoogleOauth2Utils,
        GoogleAuthService
    ],
    exports:[
        AuthService,
        GoogleAuthService
    ]
})
export class AuthModule {}