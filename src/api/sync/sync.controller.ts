import {Body, Controller, InternalServerErrorException, Post, Req, Res, UseGuards} from "@nestjs/common";
import {JwtGuard} from "../../common/guards/jwt.guard";
import {Request, Response} from "express";
import {SyncDto} from "../../dtos/SyncDto";
import {SyncService} from "./sync.service";

@Controller('sync')
export class SyncController {
    constructor(
        private readonly syncService: SyncService,
    ) {}


    @Post('days')
    @UseGuards(JwtGuard)
    async sync(@Body() body: SyncDto, @Req() req: Request & {user: {id: string}}, @Res() res: Response) {
        try {
            const response = await this.syncService.syncData(req.body, parseInt(req.user.id));
            res.status(200).json(response);
        } catch (err) {
            console.error('Sync error:', err);
            res.status(500).json({ message: 'Error during synchronization', error: err.message });
        }
    }
}