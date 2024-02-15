import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { ISearchGymsService, searchGymsService } from './search-gyms.service'
import { IGymRepository } from '@/repositories/igyms.repository'

let gymsRepository: IGymRepository
let sut: ISearchGymsService

describe('Search Gyms Service', () => {
  beforeEach(async () => {
    gymsRepository = InMemoryGymsRepository()
    sut = await searchGymsService(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Konan Acad',
      description: 'Gym from Volta Redonda',
      phone: '24999888777',
      latitude: -22.5135824,
      longitude: -44.0923966,
    })

    await gymsRepository.create({
      title: 'Tscript Gym',
      description: 'Another Gym from Volta Redonda',
      phone: '2466778899',
      latitude: -22.5135932,
      longitude: -44.0923762,
    })
    const { gyms } = await sut.execute({
      query: 'Konan',
      page: 1,
    })
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Konan Acad',
      }),
    ])
  })

  it('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Tscript Gym ${i}`,
        description: 'Another Gym from Volta Redonda',
        phone: '2466778899',
        latitude: -22.5135962,
        longitude: -44.0923788,
      })
    }
    const { gyms } = await sut.execute({
      query: 'Tscript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Tscript Gym 21' }),
      expect.objectContaining({ title: 'Tscript Gym 22' }),
    ])
  })
})
