import { Gym, Prisma } from '@prisma/client'

export interface IGymRepository {
  findById(gymId: string): Promise<Gym | null>
  create(data: Prisma.GymCreateInput): Promise<Gym>
}
