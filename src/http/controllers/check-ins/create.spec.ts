import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthUser } from '@/utils/tests/create-and-auth-user'
import { prisma } from '@/lib/database'

describe('Create CheckIn Controller E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to check-in', async () => {
    const { token } = await createAndAuthUser(app)
    // creating gym on the DB
    const gym = await prisma.gym.create({
      data: {
        title: 'TScript Gym',
        description: 'Gym from Volta Redonda',
        phone: '24999888777',
        latitude: -22.5135824,
        longitude: -44.0923966,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -22.5135824,
        longitude: -44.0923966,
      })

    expect(response.statusCode).toEqual(201)
  })
})
