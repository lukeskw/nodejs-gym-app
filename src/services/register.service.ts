import { IUserRepository } from '@/repositories/iusers.repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsException } from './exceptions/user-already-exists.exception'

interface IRegisterInput {
  name: string
  email: string
  password: string
}

interface IRegisterService {
  execute: ({ name, email, password }: IRegisterInput) => Promise<void>
}

export async function registerService(
  usersRepository: IUserRepository,
): Promise<IRegisterService> {
  async function execute({ name, email, password }: IRegisterInput) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await usersRepository.findByEmail(email)
    if (userWithSameEmail) {
      throw new UserAlreadyExistsException()
    }

    await usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
  return {
    execute,
  }
}
