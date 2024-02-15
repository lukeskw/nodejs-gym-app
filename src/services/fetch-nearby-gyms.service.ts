import { IGymRepository } from '@/repositories/igyms.repository'
import { Gym } from '@prisma/client'

interface IFetchNearbyGymsServiceRequest {
  userLatitude: number
  userLongitude: number
}

interface IFetchNearbyGymsServiceResponse {
  gyms: Gym[]
}

export interface IFetchNearbyGymsService {
  execute: ({
    userLatitude,
    userLongitude,
  }: IFetchNearbyGymsServiceRequest) => Promise<IFetchNearbyGymsServiceResponse>
}

export async function fetchNearbyGymsService(
  gymsRepository: IGymRepository,
): Promise<IFetchNearbyGymsService> {
  async function execute({
    userLatitude,
    userLongitude,
  }: IFetchNearbyGymsServiceRequest): Promise<IFetchNearbyGymsServiceResponse> {
    const gyms = await gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })
    return {
      gyms,
    }
  }
  return {
    execute,
  }
}
