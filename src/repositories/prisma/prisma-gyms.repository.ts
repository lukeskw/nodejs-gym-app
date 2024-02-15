import { Gym, Prisma } from '@prisma/client'
import { prisma } from '@/lib/database'
import { FindManyNearbyParams, IGymRepository } from '../igyms.repository'

export function GymsRepository(): IGymRepository {
  async function create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    })
    return gym
  }
  async function findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    })
    return gym
  }

  async function searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    return gyms
  }
  async function findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) )
      * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) )
      * sin( radians( latitude ) ) ) ) <= 10
    `

    return gyms
  }

  return {
    create,
    findById,
    searchMany,
    findManyNearby,
  }
}
