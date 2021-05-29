import BaseRepo from './base.repo';
import { IRole, RoleModel } from '../models/role.model';

class RoleRepo extends BaseRepo<IRole> {
	constructor() {
		super(RoleModel);
	}
}

export default RoleRepo;
