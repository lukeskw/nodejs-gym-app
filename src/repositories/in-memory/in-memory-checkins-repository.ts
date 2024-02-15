import { CheckIn, Prisma } from '@prisma/client'
import { ICheckInRepository } from '../icheckins.repository'
import dayjs from 'dayjs'

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

  async function findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDate = checkInsArr.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)
      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDate) {
      return null
    }

    return checkInOnSameDate
  }

  return {
    create,
    findByUserIdOnDate,
  }
}
