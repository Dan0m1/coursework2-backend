import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {GoogleOauth2Utils} from "./auth.google.oauth2.utils";
import {UserRepository} from "../../../database/repositories/user.repository";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class GoogleAuthService {
    constructor(
        private readonly oauthUtils: GoogleOauth2Utils,
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
    ) {}

    async signIn(token: string) {
        const {id, email, name} = await this.verifyGoogleToken(token)
        console.log(id, email, name)
        let user = await this.userRepository.findByProviderId(id)
        if(!user) {
            user = await this.registerUser({providerId: id, email, name})
        } else if (!user?.email || user.email !== email) {
            throw new InternalServerErrorException()
        }

        return this.generateJwtToken({
            sub: user.id,
            email: user.email,
        })
    }

    private async verifyGoogleToken(token: string) {
        const client = this.oauthUtils.getClient()
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        })
        const payload = ticket.getPayload();
        return {
            id: payload['sub'],
            email: payload['email'],
            name: payload['given_name']
        }
    }

    protected async registerUser(user) {
        try {
            return this.userRepository.create(user)
        } catch {
            console.log('here')
            throw new InternalServerErrorException()
        }
    }

    private generateJwtToken(payload:any) {
        return this.jwtService.sign(payload);
    }

}