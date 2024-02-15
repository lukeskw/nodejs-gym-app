import { UsersRepository } from '@/repositories/prisma/prisma-users.repository'
import { authenticateService } from '../authenticate.service'

export async function makeAuthService() {
  const usersRepository = UsersRepository()

  const auth = await authenticateService(usersRepository)

  return auth
}
