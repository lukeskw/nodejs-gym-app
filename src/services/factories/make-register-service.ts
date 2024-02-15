import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository'
import { registerService } from '../register.service'

export async function makeRegisterService() {
  const usersRepository = PrismaUsersRepository()

  const register = await registerService(usersRepository)

  return register
}
