import { searchGymsService } from '../search-gyms.service'
import { GymsRepository } from '@/repositories/prisma/prisma-gyms.repository'

export async function makeSearchGymService() {
  const gymsRepository = GymsRepository()

  const service = await searchGymsService(gymsRepository)

  return service
}
