import BaseRepo from './base.repo';
import { RoleModel } from '../models/role.model';

class RoleRepo extends BaseRepo {
	constructor() {
		super(RoleModel);
	}
}

export default RoleRepo;
