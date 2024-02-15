import { IUserRepository } from '@/repositories/iusers.repository'
import { User } from '@prisma/client'
import { ResourceNotFoundException } from './exceptions/resource-not-found.exception'

interface IGetUserProfileServiceRequest {
  userId: string
}

interface IGetUserProfileServiceResponse {
  user: User
}

export interface IGetUserProfileService {
  execute: ({
    userId,
  }: IGetUserProfileServiceRequest) => Promise<IGetUserProfileServiceResponse>
}

export async function getUserProfileService(userRepository: IUserRepository) {
  async function execute({
    userId,
  }: IGetUserProfileServiceRequest): Promise<IGetUserProfileServiceResponse> {
    const user = await userRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundException()
    }

    return {
      user,
    }
  }
  return {
    execute,
  }
}
