import { ICheckInRepository } from '@/repositories/icheckins.repository'

interface IGetUserMetricsServiceRequest {
  userId: string
}

interface IGetUserMetricsServiceResponse {
  checkInsCount: number
}

export interface IGetUserMetricsService {
  execute: ({
    userId,
  }: IGetUserMetricsServiceRequest) => Promise<IGetUserMetricsServiceResponse>
}

export async function getUserMetricsService(
  checkInRepository: ICheckInRepository,
) {
  async function execute({
    userId,
  }: IGetUserMetricsServiceRequest): Promise<IGetUserMetricsServiceResponse> {
    const checkInsCount = await checkInRepository.countByUserId(userId)

    return {
      checkInsCount,
    }
  }
  return {
    execute,
  }
}
