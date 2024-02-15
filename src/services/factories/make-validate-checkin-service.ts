import { CheckInRepository } from '@/repositories/prisma/prisma-checkins.repository'
import { validateCheckInService } from '../validate-checkin.service'

export async function makeCreateGymService() {
  const checkInRepository = CheckInRepository()

  const service = await validateCheckInService(checkInRepository)

  return service
}
