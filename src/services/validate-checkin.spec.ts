import { beforeEach, afterEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { ICheckInRepository } from '@/repositories/icheckins.repository'
import {
  IValidateCheckInService,
  validateCheckInService,
} from './validate-checkin.service'
import { randomUUID } from 'crypto'
import { ResourceNotFoundException } from './exceptions/resource-not-found.exception'

let checkinsRepository: ICheckInRepository
let sut: IValidateCheckInService

describe('Check-In Service', () => {
  beforeEach(async () => {
    checkinsRepository = InMemoryCheckInsRepository()
    sut = await validateCheckInService(checkinsRepository)

    // vi.useFakeTimers()
  })

  afterEach(() => {
    // vi.useRealTimers()
  })

  it('should be able validate the check in', async () => {
    const createdCheckIn = await checkinsRepository.create({
      gym_id: 'gym-1',
      user_id: 'user-1',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    const repositoryCheck = await checkinsRepository.findById(checkIn.id)
    expect(repositoryCheck?.validated_at).toEqual(expect.any(Date))
  })

  it('should not be able validate an inexistent check in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: randomUUID(),
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundException)
  })
})
