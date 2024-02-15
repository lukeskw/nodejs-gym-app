import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Profile Controller E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profiles', async () => {
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

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'userTest@prisma.com',
      }),
    )
  })
})
