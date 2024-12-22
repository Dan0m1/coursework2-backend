import {BadRequestException, Injectable, InternalServerErrorException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {UserRepository} from "../../database/repositories/user.repository";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userRepository: UserRepository,
    ) {}

    generateJwtToken(payload:any) {
        return this.jwtService.sign(payload);
    }

    async signIn(user){
        if (!user) {
            throw new BadRequestException('Unauthenticated');
        }

        const userExists = await this.userRepository.findById(user.id);

        if(!userExists){
            return this.registerUser(user);
        }

        return this.generateJwtToken({
            sub: userExists.id,
            email: userExists.email,
        })
    }

    async registerUser(user){
        try {
            const newUser = await this.userRepository.create(user);
            return this.generateJwtToken({
                sub: newUser.id,
                email: newUser.email,
            })
        } catch {
            throw new InternalServerErrorException()
        }
    }
}