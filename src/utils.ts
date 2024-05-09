import jwt from 'jsonwebtoken'
export const generatePasswordToken = (email: string, _id: string) => {
  if (!email || !_id) {
    throw new Error('Invalid input data')
  }
  const expiresIn = '1h'
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT secret not found')
  }
  return jwt.sign({ email, _id }, secret, { expiresIn })
}
