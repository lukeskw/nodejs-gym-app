import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthUser(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    name: 'User Test',
    email: 'userTest@prisma.com',
    password: '123456',
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'userTest@prisma.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return { token }
}
