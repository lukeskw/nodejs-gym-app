import { Prisma, User } from '@prisma/client'
import { IUserRepository } from '../iusers.repository'

export function InMemoryUsersRepository(): IUserRepository {
  const registers: User[] = []

  async function create(data: Prisma.UserCreateInput) {
    const user = {
      id: crypto.randomUUID().toString(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
      updated_at: new Date(),
    }
    registers.push(user)

    return user
  }

  async function findByEmail(email: string) {
    const user = registers.find((user) => user.email === email)

    if (!user) {
      return null
    }

    return user
  }

  return {
    create,
    findByEmail,
  }
}
