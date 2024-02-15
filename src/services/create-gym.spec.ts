import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { ICreateGymService, createGymService } from './create-gym.service'
import { IGymRepository } from '@/repositories/igyms.repository'

let gymsRepository: IGymRepository
let sut: ICreateGymService

describe('Create Gym Service', () => {
  beforeEach(async () => {
    gymsRepository = InMemoryGymsRepository()
    sut = await createGymService(gymsRepository)
  })

  it('should be able to register', async () => {
    const { gym } = await sut.execute({
      title: 'Gym test',
      description: 'Gym from Volta Redonda',
      phone: '24999888777',
      latitude: -22.5135824,
      longitude: -44.0923966,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
