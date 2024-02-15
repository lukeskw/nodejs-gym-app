import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthUser } from '@/utils/tests/create-and-auth-user'

describe('Search Gyms Controller E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to search for a gym by title', async () => {
    const { token } = await createAndAuthUser(app, true)
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TScript Gym',
        description: 'Gym from Volta Redonda',
        phone: '24999888777',
        latitude: -22.5135824,
        longitude: -44.0923966,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Konen Gym',
        description: 'AnotherGym from Volta Redonda',
        phone: '24999888777',
        latitude: -22.5135889,
        longitude: -44.0923962,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'tscript',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'TScript Gym',
      }),
    ])
  })
})
