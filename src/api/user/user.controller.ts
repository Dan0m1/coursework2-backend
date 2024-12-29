import {Controller, Get, Query} from "@nestjs/common";
import {UserService} from "./user.service";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('profile')
    async getProfile(@Query('id') id: bigint) {
        console.log('id= ', id)
        return this.userService.findOneById(id)
    }
}