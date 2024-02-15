import { Gym, Prisma } from '@prisma/client'
import { IGymRepository } from '../igyms.repository'

export const gyms: Gym[] = []
export function InMemoryGymsRepository(): IGymRepository {
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

  return {
    findById,
    create,
  }
}
