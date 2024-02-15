import { IUserRepository } from '@/repositories/iusers.repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsException } from './exceptions/user-already-exists.exception'
import { User } from '@prisma/client'

interface IRegisterInput {
  name: string
  email: string
  password: string
}

interface IUserResponse {
  user: User
}

interface IRegisterService {
  execute: ({ name, email, password }: IRegisterInput) => Promise<IUserResponse>
}

export async function registerService(
  usersRepository: IUserRepository,
): Promise<IRegisterService> {
  async function execute({
    name,
    email,
    password,
  }: IRegisterInput): Promise<IUserResponse> {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await usersRepository.findByEmail(email)
    if (userWithSameEmail) {
      console.log()
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
