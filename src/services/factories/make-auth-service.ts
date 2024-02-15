import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository'
import { authenticateService } from '../authenticate.service'

export async function makeAuthService() {
  const usersRepository = PrismaUsersRepository()

  const auth = await authenticateService(usersRepository)

  return auth
}
