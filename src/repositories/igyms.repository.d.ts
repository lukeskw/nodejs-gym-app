import { Gym } from '@prisma/client'

export interface IGymRepository {
  findById(gymId: string): Promise<Gym | null>
  addGym(gym: Gym): Promise<Gym[]>
}
