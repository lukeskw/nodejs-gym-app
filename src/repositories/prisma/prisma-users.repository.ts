import { prisma } from '@/lib/database'
import { Prisma } from '@prisma/client'
import { IUserRepository } from '../iusers.repository'

export function PrismaUsersRepository(): IUserRepository {
  async function create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })
    return user
  }
  async function findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    return user
  }

  async function findById(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
    return user
  }

  return {
    create,
    findByEmail,
    findById,
  }
}
