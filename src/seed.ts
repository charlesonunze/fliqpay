import { logger } from './utils/main.logger';
import { connectDB, disconnectDB } from './startup/db';
import { RoleModel, Roles } from './models/role.model';
import { IUserObject, UserModel } from './models/user.model';
import { TicketModel } from './models/ticket.model';
import { CommentModel } from './models/comment.model';
import UserService from './services/user.service';
import RolesService from './services/roles.service';

const users: IUserObject[] = [
	{
		username: 'admin1',
		email: 'admin1@tickets.io',
		role: Roles.Admin,
		password: 'admin1'
	},
	{
		username: 'agent1',
		email: 'agent1@tickets.io',
		role: Roles.Agent,
		password: 'agent1'
	},
	{
		username: 'agent2',
		email: 'agent2@tickets.io',
		role: Roles.Agent,
		password: 'agent2'
	},
	{
		username: 'agent3',
		email: 'agent3@tickets.io',
		role: Roles.Agent,
		password: 'agent3'
	},
	{
		username: 'customer1',
		email: 'customer1@tickets.io',
		role: Roles.Customer,
		password: 'customer1'
	},
	{
		username: 'customer2',
		email: 'customer2@tickets.io',
		role: Roles.Customer,
		password: 'customer2'
	},
	{
		username: 'customer3',
		email: 'customer3@tickets.io',
		role: Roles.Customer,
		password: 'customer3'
	}
];

const roles = [
	{ name: Roles.Admin },
	{ name: Roles.Agent },
	{ name: Roles.Customer }
];

(async () => {
	connectDB();

	await UserModel.deleteMany({});
	await RoleModel.deleteMany({});
	await TicketModel.deleteMany({});
	await CommentModel.deleteMany({});

	const _users = users.map((user) => {
		return new Promise((resolve, reject) => {
			UserService.createUser(user)
				.then((user: unknown) => {
					resolve(user);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	});

	const _roles = roles.map((role) => {
		return new Promise((resolve, reject) => {
			RolesService.createRole(role.name)
				.then((role: unknown) => {
					resolve(role);
				})
				.catch((error: any) => {
					reject(error);
				});
		});
	});

	Promise.all([..._users, ..._roles])
		.then((results) => {
			logger.info(JSON.stringify(results));
			logger.info('=====================');
		})
		.catch((err) => {
			logger.error(err);
		})
		.finally(() => {
			disconnectDB();
		});
})();
