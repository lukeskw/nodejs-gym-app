import { Gym } from '@prisma/client'
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
  async function addGym(gym: Gym) {
    gyms.push(gym)

    return gyms
  }

  return {
    findById,
    addGym,
  }
}
