import { app } from '@/app'
import { prisma } from '@/lib/database'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthUser(
  app: FastifyInstance,
  isAdmin?: boolean = false,
) {
  const user = await prisma.user.create({
    data: {
      name: 'Lucas Admin',
      email: 'userTest@prisma.com',
      password_hash: await hash('123456', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'userTest@prisma.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return { token }
}
