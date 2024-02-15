import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { IAuthService, authenticateService } from './authenticate.service'
import { hash } from 'bcryptjs'
import { InvalidCredentialsException } from './exceptions/invalid-credentials.exception'
import { IUserRepository } from '@/repositories/iusers.repository'

let usersRepository: IUserRepository
let sut: IAuthService

describe('Auth Service', () => {
  beforeEach(async () => {
    usersRepository = InMemoryUsersRepository()
    sut = await authenticateService(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'User Test',
      email: 'userTest@prisma.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'userTest@prisma.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
  it('should be able to authenticate with wrong email', async () => {
    await usersRepository.create({
      name: 'User Test',
      email: 'userTest@prisma.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'typo@prisma.com', // wrong email
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsException)
  })
  it('should be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'User Test',
      email: 'userTest@prisma.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'userTest@prisma.com',
        password: '1234567', // wrong password
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsException)
  })
})
