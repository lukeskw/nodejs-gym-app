import { CheckIn } from '@prisma/client'
import { ICheckInRepository } from '@/repositories/icheckins.repository'

interface IFetchUserCheckInsHistoryServiceRequest {
  userId: string
  page: number
}

interface IFetchUserCheckInsHistoryServiceResponse {
  checkIns: CheckIn[]
}

export interface IFetchUserCheckInsHistoryService {
  execute: ({
    userId,
  }: IFetchUserCheckInsHistoryServiceRequest) => Promise<IFetchUserCheckInsHistoryServiceResponse>
}

export async function fetchUserCheckInsHistoryService(
  checkInRepository: ICheckInRepository,
) {
  async function execute({
    userId,
    page,
  }: IFetchUserCheckInsHistoryServiceRequest): Promise<IFetchUserCheckInsHistoryServiceResponse> {
    const checkIns = await checkInRepository.findManyByUserId(userId, page)

    return {
      checkIns,
    }
  }
  return {
    execute,
  }
}
