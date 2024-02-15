import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthUser } from '@/utils/tests/create-and-auth-user'

describe('Nearby Gyms Controller E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthUser(app)
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TScript Gym',
        description: 'Gym from BM',
        phone: '24999888777',
        latitude: -23.5431459,
        longitude: -44.172764,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Konen Gym',
        description: 'AnotherGym from Volta Redonda',
        phone: '24999888777',
        latitude: -22.5135824,
        longitude: -44.0923966,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -22.5135824,
        longitude: -44.0923966,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Konen Gym',
      }),
    ])
  })
})
