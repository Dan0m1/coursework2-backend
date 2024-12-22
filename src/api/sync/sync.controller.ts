import {Body, Controller, Post, Req, UseGuards} from "@nestjs/common";
import {JwtGuard} from "../../common/guards/jwt.guard";
import {Request} from "express";
import {SyncDto} from "../../dtos/SyncDto";
import {SyncService} from "./sync.service";

@Controller('sync')
export class SyncController {
    constructor(
        private readonly syncService: SyncService,
    ) {}


    @Post('days')
    @UseGuards(JwtGuard)
    async sync(@Body() body: SyncDto, @Req() req: Request & {user: {id: string}}) {
        const userId = req.user.id;
        console.log(JSON.stringify(body, null, 2));
        return this.syncService.sync();
    }
}