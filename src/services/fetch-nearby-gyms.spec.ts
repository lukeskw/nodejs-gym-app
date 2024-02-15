import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import {
  IFetchNearbyGymsService,
  fetchNearbyGymsService,
} from './fetch-nearby-gyms.service'
import { IGymRepository } from '@/repositories/igyms.repository'

let gymsRepository: IGymRepository
let sut: IFetchNearbyGymsService

describe('Fetch Nearby Gyms Service', () => {
  beforeEach(async () => {
    gymsRepository = InMemoryGymsRepository()
    sut = await fetchNearbyGymsService(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Konan Acad',
      description: 'Gym from Volta Redonda',
      phone: '24999888777',
      latitude: -22.5135824,
      longitude: -44.0923966,
    })

    await gymsRepository.create({
      title: 'Tscript Gym',
      description: 'Another Gym from BM',
      phone: '2466778899',
      latitude: -23.5431459,
      longitude: -44.172764,
    })
    const { gyms } = await sut.execute({
      userLatitude: -22.5135824,
      userLongitude: -44.0923966,
    })
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Konan Acad',
      }),
    ])
  })
})
