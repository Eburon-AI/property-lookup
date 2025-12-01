import { User } from '@eburon/db';
import { SafeUserType } from 'src/types/safeUserType';

export const getSafeUser = (user: User): SafeUserType => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};
