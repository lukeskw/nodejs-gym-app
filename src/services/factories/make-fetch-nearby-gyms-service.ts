import { GymsRepository } from '@/repositories/prisma/prisma-gyms.repository'
import { fetchNearbyGymsService } from '../fetch-nearby-gyms.service'

export async function makeFetchNearbyGymService() {
  const gymsRepository = GymsRepository()

  const service = await fetchNearbyGymsService(gymsRepository)

  return service
}
