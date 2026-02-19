import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultStatements } from 'better-auth/plugins/admin/access';

const statement = {
  ...defaultStatements,
} as const;

const ac = createAccessControl(statement);

const admin = ac.newRole({
  ...adminAc.statements,
});

const accountant = ac.newRole({});

const client = ac.newRole({});

export { ac, accountant, admin, client };
