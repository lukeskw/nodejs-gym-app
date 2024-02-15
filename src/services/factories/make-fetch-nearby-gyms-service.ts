import { GymsRepository } from '@/repositories/prisma/prisma-gyms.repository'
import { fetchNearbyGymsService } from '../fetch-nearby-gyms.service'

export async function makeCreateGymService() {
  const gymsRepository = GymsRepository()

  const service = await fetchNearbyGymsService(gymsRepository)

  return service
}
