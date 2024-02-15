import { IGymRepository } from '@/repositories/igyms.repository'
import { Gym } from '@prisma/client'

interface ICreateGymServiceRequest {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface ICreateGymServiceResponse {
  gym: Gym
}

export interface ICreateGymService {
  execute: ({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: ICreateGymServiceRequest) => Promise<ICreateGymServiceResponse>
}

export async function createGymService(
  gymsRepository: IGymRepository,
): Promise<ICreateGymService> {
  async function execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: ICreateGymServiceRequest): Promise<ICreateGymServiceResponse> {
    const gym = await gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    })
    return {
      gym,
    }
  }
  return {
    execute,
  }
}
