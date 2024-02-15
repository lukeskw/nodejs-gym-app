import { GymsRepository } from '@/repositories/prisma/prisma-gyms.repository'
import { createGymService } from '../create-gym.service'

export async function makeCreateGymService() {
  const gymsRepository = GymsRepository()

  const service = await createGymService(gymsRepository)

  return service
}
