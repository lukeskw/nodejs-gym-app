import { fetchUserCheckInsHistoryService } from '../fetch-user-checkins-history.service'
import { CheckInRepository } from '@/repositories/prisma/prisma-checkins.repository'

export async function makeFetchUserCheckInsHistoryService() {
  const checkInRepository = CheckInRepository()

  const service = await fetchUserCheckInsHistoryService(checkInRepository)

  return service
}
