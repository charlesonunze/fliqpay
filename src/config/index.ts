import { config } from 'dotenv';

config();

let PORT: string;
let DB_URI: string;
let JWT_PRIVATE_KEY: string;
let JWT_EXPIRY_TIME: string;

switch (process.env.NODE_ENV) {
	case 'production':
		PORT = process.env.PORT!;
		DB_URI = process.env.DB_URI!;
		JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY!;
		JWT_EXPIRY_TIME = process.env.JWT_EXPIRY_TIME!;
		break;

	case 'development':
		PORT = process.env.PORT_DEV!;
		DB_URI = process.env.DB_URI_DEV!;
		JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY_DEV!;
		JWT_EXPIRY_TIME = process.env.JWT_EXPIRY_TIME_DEV!;
		break;

	case 'test':
		PORT = process.env.PORT_TEST!;
		DB_URI = process.env.DB_URI_TEST!;
		JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY_TEST!;
		JWT_EXPIRY_TIME = process.env.JWT_EXPIRY_TIME_TEST!;
		break;

	default:
		PORT = process.env.PORT_DEV!;
		DB_URI = process.env.DB_URI_DEV!;
		JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY_DEV!;
		JWT_EXPIRY_TIME = process.env.JWT_EXPIRY_TIME_DEV!;
		break;
}

export { PORT, DB_URI, JWT_PRIVATE_KEY, JWT_EXPIRY_TIME };
