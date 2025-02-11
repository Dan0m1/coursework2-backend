import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {DatabaseModule} from "./database/database.module";
import {ApiModule} from "./api/api.module";

@Module({
  imports: [DatabaseModule, ApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
