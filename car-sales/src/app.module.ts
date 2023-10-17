import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/model/user.entity';
import { Report } from './reports/report.entity';

@Module({
  imports: [
    UsersModule,
    ReportsModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite', // TypeORM creates db.sqlite file automatically
      entities: [User, Report],
      synchronize: true, // only for development — automatically updates DB based on the structure of the entities without migrations
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
