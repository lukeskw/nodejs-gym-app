import { IGymRepository } from '@/repositories/igyms.repository'
import { Gym } from '@prisma/client'

interface ISearchGymsServiceRequest {
  query: string
  page: number
}

interface ISearchGymsServiceResponse {
  gyms: Gym[]
}

export interface ISearchGymsService {
  execute: ({
    query,
    page,
  }: ISearchGymsServiceRequest) => Promise<ISearchGymsServiceResponse>
}

export async function searchGymsService(
  gymsRepository: IGymRepository,
): Promise<ISearchGymsService> {
  async function execute({
    query,
    page,
  }: ISearchGymsServiceRequest): Promise<ISearchGymsServiceResponse> {
    const gyms = await gymsRepository.searchMany(query, page)
    return {
      gyms,
    }
  }
  return {
    execute,
  }
}
