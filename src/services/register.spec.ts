import { describe, expect, it } from 'vitest'
import { registerService } from './register.service'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsException } from './exceptions/user-already-exists.exception'

describe('Register Service', () => {
  it('should be able to register', async () => {
    const usersRepository = InMemoryUsersRepository()
    const register = await registerService(usersRepository)

    const { user } = await register.execute({
      name: 'User Test',
      email: 'userTest@prisma.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
  it('should hash the user password upon registration', async () => {
    // as unit tests go, we should not need to implement the userRepository, because this type of test should not depend on databases
    // const usersRepository = PrismaUsersRepository()

    const usersRepository = InMemoryUsersRepository()
    const register = await registerService(usersRepository)

    const { user } = await register.execute({
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
    const usersRepository = InMemoryUsersRepository()
    const register = await registerService(usersRepository)

    const email = 'userTest@prisma.com'

    await register.execute({
      name: 'User Test',
      email,
      password: '123456',
    })

    expect(async () =>
      register.execute({
        name: 'User Test',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsException)
  })
})
