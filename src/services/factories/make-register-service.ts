import { UsersRepository } from '@/repositories/prisma/prisma-users.repository'
import { registerService } from '../register.service'

export async function makeRegisterService() {
  const usersRepository = UsersRepository()

  const register = await registerService(usersRepository)

  return register
}
