import { GymsRepository } from '@/repositories/prisma/prisma-gyms.repository'
import { checkInService } from '../checkin.service'
import { CheckInRepository } from '@/repositories/prisma/prisma-checkins.repository'

export async function makeCheckInService() {
  const checkInsRepository = CheckInRepository()
  const gymsRepository = GymsRepository()

  const service = await checkInService(checkInsRepository, gymsRepository)

  return service
}
