import {Injectable, UnauthorizedException} from "@nestjs/common";
import { ExtractJwt, Strategy } from 'passport-jwt';
import {PassportStrategy} from "@nestjs/passport";
import {UserRepository} from "../../database/repositories/user.repository";

export type JwtPayload = {
    sub: string;
    email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userRepository: UserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.userRepository.findById(BigInt(payload.sub))

        if(!user) {
            throw new UnauthorizedException("Please log in to proceed!")
        }

        return {
            id: payload.sub,
            email: payload.email
        }
    }
}
