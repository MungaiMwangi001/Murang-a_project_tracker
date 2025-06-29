import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

// ✅ Validate and safely type environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

// ✅ Token payload shape
export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

// ✅ Extended decoded token shape
export interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

// ✅ Generate a signed token with proper type cast
export const generateToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as unknown as SignOptions['expiresIn'], // 👈 FIXED
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

// ✅ Verify a token and return the decoded payload
export const verifyToken = (token: string): DecodedToken => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};
