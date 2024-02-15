import { CheckIn } from '@prisma/client'
import { ICheckInRepository } from '@/repositories/icheckins.repository'
import { IGymRepository } from '@/repositories/igyms.repository'
import { ResourceNotFoundException } from './exceptions/resource-not-found.exception'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { MaxDistanceException } from './exceptions/max-distance.exception'
import { MaxNumberOfCheckInsException } from './exceptions/max-number-of-checkins.expection'

const MAX_DISTANCE_IN_KILOMETERS = 0.1
interface ICheckInServiceRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
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

export async function checkInService(
  checkInRepository: ICheckInRepository,
  gymsRepository: IGymRepository,
) {
  async function execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: ICheckInServiceRequest): Promise<ICheckInServiceResponse> {
    const gym = await gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundException()
    }

    // calculate distance between user and gym

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceException()
    }

    const checkInOnSameDate = await checkInRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )
    const checkIn = await checkInRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    if (checkInOnSameDate) {
      throw new MaxNumberOfCheckInsException()
    }

    return {
      checkIn,
    }
  }
  return {
    execute,
  }
}
