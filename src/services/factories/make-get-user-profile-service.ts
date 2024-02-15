import { UsersRepository } from '@/repositories/prisma/prisma-users.repository'
import { getUserProfileService } from '../get-user-profile.service'

export async function makeGetUserProfileService() {
  const usersRepository = UsersRepository()

  const service = await getUserProfileService(usersRepository)

  return service
}
