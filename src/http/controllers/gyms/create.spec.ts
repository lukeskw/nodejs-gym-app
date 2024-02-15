import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthUser } from '@/utils/tests/create-and-auth-user'

describe('Create Gym Controller E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthUser(app)
    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TScript Gym',
        description: 'Gym from Volta Redonda',
        phone: '24999888777',
        latitude: -22.5135824,
        longitude: -44.0923966,
      })

    expect(response.statusCode).toEqual(201)
  })
})
