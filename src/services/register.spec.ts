import { beforeEach, describe, expect, it } from 'vitest'
import { IRegisterService, registerService } from './register.service'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsException } from './exceptions/user-already-exists.exception'
import { IUserRepository } from '@/repositories/iusers.repository'

let usersRepository: IUserRepository
let sut: IRegisterService

describe('Register Service', () => {
  beforeEach(async () => {
    usersRepository = InMemoryUsersRepository()
    sut = await registerService(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'User Test',
      email: 'userTest@prisma.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
  it('should hash the user password upon registration', async () => {
    // as unit tests go, we should not need to implement the userRepository, because this type of test should not depend on databases
    // const usersRepository = PrismaUsersRepository()

    // const usersRepository = InMemoryUsersRepository()
    // const sut = await registerService(usersRepository)

    const { user } = await sut.execute({
      name: 'User Test',
      email: 'userTest@prisma.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email', async () => {
    const email = 'userTest@prisma.com'

    await sut.execute({
      name: 'User Test',
      email,
      password: '123456',
    })

    await expect(async () =>
      sut.execute({
        name: 'User Test',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsException)
  })
})
