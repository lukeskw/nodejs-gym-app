import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { ICheckInRepository } from '@/repositories/icheckins.repository'
import {
  IValidateCheckInService,
  validateCheckInService,
} from './validate-checkin.service'
import { randomUUID } from 'crypto'
import { ResourceNotFoundException } from './exceptions/resource-not-found.exception'
import { s } from 'vitest/dist/reporters-1evA5lom'
import { LateCheckInValidationException } from './exceptions/late-checkin-validation.exception'

let checkinsRepository: ICheckInRepository
let sut: IValidateCheckInService

describe('Check-In Service', () => {
  beforeEach(async () => {
    checkinsRepository = InMemoryCheckInsRepository()
    sut = await validateCheckInService(checkinsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
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

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2024, 1, 15, 8, 0))

    const createdCheckIn = await checkinsRepository.create({
      gym_id: 'gym-1',
      user_id: 'user-1',
    })

    const TWENTY_ONE_MINUTES_IN_MS = 1000 * 60 * 21

    vi.advanceTimersByTime(TWENTY_ONE_MINUTES_IN_MS)

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationException)
  })
})
