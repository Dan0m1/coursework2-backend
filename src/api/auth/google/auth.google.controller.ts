import {
    BadRequestException,
    Body,
    Controller,
    HttpStatus,
    InternalServerErrorException,
    Post,
    Res
} from "@nestjs/common";
import {GoogleAuthService} from "./auth.google.service";
import {Response} from "express";

@Controller('auth/google')
export class GoogleAuthController {
    constructor(
        private googleAuthService: GoogleAuthService,
    ) {}

    @Post('login')
    async login(@Body('idToken') idToken: string, @Res() res: Response) {
        console.log("id: ", idToken)
        if (!idToken) {
            throw new BadRequestException('Missing idToken');
        }
        try {
            const token = await this.googleAuthService.signIn(idToken);
            console.log("here")
            return res.status(HttpStatus.OK).json([{access_token: token}]);
        } catch (e) {
            throw new Error(e)
        }
    }
}