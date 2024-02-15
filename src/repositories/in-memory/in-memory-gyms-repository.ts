import { Gym, Prisma } from '@prisma/client'
import { FindManyNearbyParams, IGymRepository } from '../igyms.repository'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

const GYMS_IN_10_KM_RANGE = 10

export function InMemoryGymsRepository(): IGymRepository {
  const gyms: Gym[] = []
  async function findById(gymId: string) {
    const gym = gyms.find((gym) => gym.id === gymId)

    if (!gym) {
      return null
    }

    return gym
  }

  async function create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? crypto.randomUUID().toString(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
      updated_at: new Date(),
    }
    gyms.push(gym)
    return gym
  }

  async function searchMany(query: string, page: number) {
    return gyms
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async function findManyNearby(params: FindManyNearbyParams) {
    return gyms.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      )

      return distance < GYMS_IN_10_KM_RANGE
    })
  }

  return {
    findById,
    create,
    searchMany,
    findManyNearby,
  }
}
