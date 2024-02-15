import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { ICheckInRepository } from '@/repositories/icheckins.repository'
import {
  IGetUserMetricsService,
  getUserMetricsService,
} from './get-user-metrics.service'

let checkinsRepository: ICheckInRepository
let sut: IGetUserMetricsService

describe('Get User Metrics Service', () => {
  beforeEach(async () => {
    checkinsRepository = InMemoryCheckInsRepository()
    sut = await getUserMetricsService(checkinsRepository)
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkinsRepository.create({
      user_id: 'user-1',
      gym_id: 'gym-1',
    })

    await checkinsRepository.create({
      user_id: 'user-1',
      gym_id: 'gym-2',
    })
    const { checkInsCount } = await sut.execute({
      userId: 'user-1',
    })

    expect(checkInsCount).toEqual(2)
  })
})
