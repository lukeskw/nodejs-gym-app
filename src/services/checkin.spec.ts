import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { ICheckInService, checkInService } from './checkin.service'
import { ICheckInRepository } from '@/repositories/icheckins.repository'
import { IGymRepository } from '@/repositories/igyms.repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { ResourceNotFoundException } from './exceptions/resource-not-found.exception'
import { MaxNumberOfCheckInsException } from './exceptions/max-number-of-checkins.expection'
import { MaxDistanceException } from './exceptions/max-distance.exception'

let checkinsRepository: ICheckInRepository
let gymsRepository: IGymRepository
let sut: ICheckInService

describe('Check-In Service', () => {
  beforeEach(async () => {
    checkinsRepository = InMemoryCheckInsRepository()
    gymsRepository = InMemoryGymsRepository()
    sut = await checkInService(checkinsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-1',
      title: 'gym test',
      description: 'test',
      phone: '999888777',
      latitude: new Decimal(-22.5160963),
      longitude: new Decimal(-44.102109),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -22.5160963,
      userLongitude: -44.102109,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in if gym is not registered', async () => {
    await expect(() =>
      sut.execute({
        gymId: 'gym-5',
        userId: 'user-1',
        userLatitude: -22.5160963,
        userLongitude: -44.102109,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundException)
  })

  it('should not be able to check in twice on the same day', async () => {
    vi.setSystemTime(new Date(2024, 1, 15, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -22.5160963,
      userLongitude: -44.102109,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-1',
        userId: 'user-1',
        userLatitude: -22.5160963,
        userLongitude: -44.102109,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsException)
  })

  it('should be able to check in twice but on different days', async () => {
    vi.setSystemTime(new Date(2024, 1, 15, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -22.5160963,
      userLongitude: -44.102109,
    })

    vi.setSystemTime(new Date(2024, 1, 16, 8, 0, 0))
    const { checkIn } = await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -22.5160963,
      userLongitude: -44.102109,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })
  it('should not be able to check in on a distant gym', async () => {
    await gymsRepository.create({
      id: 'gym-2',
      title: 'gym test 2',
      description: 'test 2',
      phone: '9998887776',
      latitude: new Decimal(-22.517579),
      longitude: new Decimal(-44.0009755),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-2',
        userId: 'user-1',
        userLatitude: -22.5160963,
        userLongitude: -44.102109,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceException)
  })
})
