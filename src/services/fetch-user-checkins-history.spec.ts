import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import {
  IFetchUserCheckInsHistoryService,
  fetchUserCheckInsHistoryService,
} from './fetch-user-checkins-history.service'
import { ICheckInRepository } from '@/repositories/icheckins.repository'

let checkinsRepository: ICheckInRepository
let sut: IFetchUserCheckInsHistoryService

describe('Fetch User Check-Ins History Service', () => {
  beforeEach(async () => {
    checkinsRepository = InMemoryCheckInsRepository()
    sut = await fetchUserCheckInsHistoryService(checkinsRepository)
  })

  it('should be able to fetch check ins history', async () => {
    await checkinsRepository.create({
      user_id: 'user-1',
      gym_id: 'gym-1',
    })

    await checkinsRepository.create({
      user_id: 'user-1',
      gym_id: 'gym-2',
    })
    const { checkIns } = await sut.execute({
      userId: 'user-1',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({
        gym_id: 'gym-1',
        user_id: 'user-1',
      }),
      expect.objectContaining({
        gym_id: 'gym-2',
        user_id: 'user-1',
      }),
    ])
  })

  it('should be able to fetch paginated check in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkinsRepository.create({
        user_id: 'user-1',
        gym_id: `gym-${i}`,
      })
    }
    const { checkIns } = await sut.execute({
      userId: 'user-1',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})
