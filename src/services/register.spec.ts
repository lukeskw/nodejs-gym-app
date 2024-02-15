import { describe, expect, it } from 'vitest'
import { registerService } from './register.service'
import { compare } from 'bcryptjs'

describe('Register Service', () => {
  it('should hash the user password upon registration', async () => {
    // as unit tests go, we should not need to implement the userRepository, because this type of test should not depend on databases
    // const usersRepository = PrismaUsersRepository()

    const register = await registerService({
      async findByEmail() {
        return null
      },
      async create(data) {
        return {
          id: crypto.randomUUID().toString(),
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
          updated_at: new Date(),
        }
      },
    })

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
})
