import { Gym, Prisma } from '@prisma/client'
import { IGymRepository } from '../igyms.repository'

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

  return {
    findById,
    create,
    searchMany,
  }
}
