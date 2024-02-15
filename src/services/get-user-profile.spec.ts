import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { IUserRepository } from '@/repositories/iusers.repository'
import {
  IGetUserProfileService,
  getUserProfileService,
} from './get-user-profile.service'
import { hash } from 'bcryptjs'
import { ResourceNotFoundException } from './exceptions/resource-not-found.exception'

let usersRepository: IUserRepository
let sut: IGetUserProfileService

describe('Get User Profile Service', () => {
  beforeEach(async () => {
    usersRepository = InMemoryUsersRepository()
    sut = await getUserProfileService(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const newUser = await usersRepository.create({
      name: 'User Test',
      email: 'userTest@prisma.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: newUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.email).toEqual('userTest@prisma.com')
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(async () =>
      sut.execute({
        userId: crypto.randomUUID(),
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundException)
  })
})
