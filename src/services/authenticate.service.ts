import { IUserRepository } from '@/repositories/iusers.repository'
import { InvalidCredentialsException } from './exceptions/invalid-credentials.exception'
import { compare } from 'bcryptjs'
import { User } from '@prisma/client'

interface IAuthServiceRequest {
  email: string
  password: string
}

interface IAuthServiceResponse {
  user: User
}

export interface IAuthService {
  execute: ({
    email,
    password,
  }: IAuthServiceRequest) => Promise<IAuthServiceResponse>
}

export async function authenticateService(userRepository: IUserRepository) {
  async function execute({
    email,
    password,
  }: IAuthServiceRequest): Promise<IAuthServiceResponse> {
    const user = await userRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsException()
    }

    const doesPasswordMatch = await compare(password, user.password_hash)

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsException()
    }

    return {
      user,
    }
  }
  return {
    execute,
  }
}
