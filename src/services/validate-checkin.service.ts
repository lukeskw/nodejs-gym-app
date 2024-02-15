import { CheckIn } from '@prisma/client'
import { ICheckInRepository } from '@/repositories/icheckins.repository'
import { ResourceNotFoundException } from './exceptions/resource-not-found.exception'

interface IValidateCheckInServiceRequest {
  checkInId: string
}

interface IValidateCheckInServiceResponse {
  checkIn: CheckIn
}

export interface IValidateCheckInService {
  execute: ({
    checkInId,
  }: IValidateCheckInServiceRequest) => Promise<IValidateCheckInServiceResponse>
}

export async function validateCheckInService(
  checkInRepository: ICheckInRepository,
) {
  async function execute({
    checkInId,
  }: IValidateCheckInServiceRequest): Promise<IValidateCheckInServiceResponse> {
    const checkIn = await checkInRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundException()
    }

    checkIn.validated_at = new Date()

    await checkInRepository.save(checkIn)

    return {
      checkIn,
    }
  }
  return {
    execute,
  }
}
