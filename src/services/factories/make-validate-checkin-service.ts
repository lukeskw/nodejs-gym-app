import { CheckInRepository } from '@/repositories/prisma/prisma-checkins.repository'
import { validateCheckInService } from '../validate-checkin.service'

export async function makeValidateCheckInService() {
  const checkInRepository = CheckInRepository()

  const service = await validateCheckInService(checkInRepository)

  return service
}
