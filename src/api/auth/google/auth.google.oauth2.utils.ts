import {Injectable, OnModuleDestroy, OnModuleInit} from "@nestjs/common";
import {OAuth2Client} from "google-auth-library";

@Injectable()
export class GoogleOauth2Utils implements OnModuleInit, OnModuleDestroy{
    private googleOauth2Client: OAuth2Client;

    async onModuleInit() {
        this.googleOauth2Client = new OAuth2Client({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        });
    }

    async onModuleDestroy() {
        this.googleOauth2Client = null;
    }

    getClient() {
        return this.googleOauth2Client;
    }
}