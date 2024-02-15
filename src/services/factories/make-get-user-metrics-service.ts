import { getUserMetricsService } from '../get-user-metrics.service'
import { CheckInRepository } from '@/repositories/prisma/prisma-checkins.repository'

export async function makeGetUserMetricsService() {
  const checkInsRepository = CheckInRepository()

  const service = await getUserMetricsService(checkInsRepository)

  return service
}
