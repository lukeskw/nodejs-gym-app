import { CheckIn, Prisma } from '@prisma/client'
import { ICheckInRepository } from '../icheckins.repository'

export function InMemoryCheckInsRepository(): ICheckInRepository {
  const checkInsArr: CheckIn[] = []

  async function create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: crypto.randomUUID().toString(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
      updated_at: new Date(),
    }
    checkInsArr.push(checkIn)

    return checkIn
  }

  return {
    create,
  }
}
