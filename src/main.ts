import * as path from 'path';

import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

import { ApplicationModule } from './app.module';

async function bootstrap() {
	const server = express();

	const app = await NestFactory.create(ApplicationModule, server);
	app.use(cors({
		origin: true,
		credentials: true,
	}));
	app.use(bodyParser.json());
	app.use(express.static(path.join(__dirname, '../client/dist')));

	await app.listen(+process.env.PORT || 3000);
}
bootstrap();
