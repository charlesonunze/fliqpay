import {
	Roles,
	AdminClaims,
	AgentClaims,
	CustomerClaims,
	IRoleObject
} from '../models/role.model';
import RoleRepo from '../repos/role.repo';
import { DuplicateResourceError } from '../utils/errorHandler';

const roleRepo = new RoleRepo();

class RolesService {
	static async createRole(role: Roles) {
		const _role = await roleRepo.findOne({ name: role });
		if (_role) throw new DuplicateResourceError('This role already exists.');

		const userRole = {} as IRoleObject;
		userRole.name = role;

		switch (role) {
			case Roles.Admin:
				userRole.claims = Object.values(AdminClaims);
				return await roleRepo.insertOne(userRole);

			case Roles.Agent:
				userRole.claims = Object.values(AgentClaims);
				return await roleRepo.insertOne(userRole);

			case Roles.Customer:
				userRole.claims = Object.values(CustomerClaims);
				return await roleRepo.insertOne(userRole);
		}
	}

	static async getRole(role: Roles) {
		return await roleRepo.findOne({ name: role });
	}
}

export default RolesService;
