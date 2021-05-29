import { Document, Schema, model } from 'mongoose';

enum AdminClaims {
	CanManageUsers = 'can_manage_users',
	CanViewTickets = 'can_view_tickets',
	CanManageTickets = 'can_manage_tickets'
}

enum AgentClaims {
	CanViewTickets = 'can_view_tickets',
	CanManageTickets = 'can_manage_tickets'
}

enum CustomerClaims {
	CanViewTickets = 'can_view_tickets',
	CanCreateTickets = 'can_create_tickets'
}

const Claims = {
	...AdminClaims,
	...AgentClaims,
	...CustomerClaims
};

type Claims = AdminClaims | AgentClaims | CustomerClaims;

enum Roles {
	Admin = 'admin',
	Agent = 'agent',
	Customer = 'customer'
}

interface IRole extends Document {
	name: string;
	claims: Claims[];
}

interface IRoleObject {
	name: IRole['name'];
	claims: IRole['claims'];
}

const roleSchema = new Schema({
	name: {
		type: String,
		enum: Object.values(Roles)
	},
	claims: [{ type: String, enum: Object.values(Claims) }]
});

roleSchema.index({ name: 1 });

const RoleModel = model<IRole>('Role', roleSchema);

export {
	IRoleObject,
	RoleModel,
	Roles,
	Claims,
	AdminClaims,
	AgentClaims,
	CustomerClaims
};
