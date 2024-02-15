import { IUserRepository } from '@/repositories/iusers.repository'
import { InvalidCredentialsException } from './exceptions/invalid-credentials.exception'
import { compare } from 'bcryptjs'
import { CheckIn } from '@prisma/client'
import { ICheckInRepository } from '@/repositories/icheckins.repository'

interface ICheckInServiceRequest {
  userId: string
  gymId: string
}

interface ICheckInServiceResponse {
  checkIn: CheckIn
}

export interface ICheckInService {
  execute: ({
    userId,
    gymId,
  }: ICheckInServiceRequest) => Promise<ICheckInServiceResponse>
}

export async function checkInService(checkInRepository: ICheckInRepository) {
  async function execute({
    userId,
    gymId,
  }: ICheckInServiceRequest): Promise<ICheckInServiceResponse> {
    const checkIn = await checkInRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return {
      checkIn,
    }
  }
  return {
    execute,
  }
}
