import { IUserRepository } from '@/repositories/iusers.repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsException } from './exceptions/user-already-exists.exception'
import { User } from '@prisma/client'

interface IRegisterRequest {
  name: string
  email: string
  password: string
}

interface IUserResponse {
  user: User
}

export interface IRegisterService {
  execute: ({
    name,
    email,
    password,
  }: IRegisterRequest) => Promise<IUserResponse>
}

export async function registerService(
  usersRepository: IUserRepository,
): Promise<IRegisterService> {
  async function execute({
    name,
    email,
    password,
  }: IRegisterRequest): Promise<IUserResponse> {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await usersRepository.findByEmail(email)
    if (userWithSameEmail) {
      throw new UserAlreadyExistsException()
    }

    const user = await usersRepository.create({
      name,
      email,
      password_hash,
    })
    return {
      user,
    }
  }
  return {
    execute,
  }
}
