import {Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards} from "@nestjs/common";

import {AuthService} from "./auth.service";
import {Response} from "express";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}
}