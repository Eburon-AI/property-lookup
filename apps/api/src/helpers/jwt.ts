import { SafeUserType } from 'src/types/safeUserType';
import * as jwt from 'jsonwebtoken';

export const generateAccessToken = (safeUser: SafeUserType): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = Number(process.env.JWT_EXPIRES_IN);

  if (!secret) throw new Error('JWT_SECRET is not defined');
  if (!expiresIn) throw new Error('JWT_EXPIRES_IN is not defined');

  return jwt.sign({ data: safeUser }, secret, { expiresIn });
};
