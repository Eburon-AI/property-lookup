import { UserRole } from '@eburon/db';

export type SafeUserType = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};
