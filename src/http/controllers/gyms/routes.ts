import { FastifyInstance } from 'fastify'

import { verifyJWT } from '../middlewares/verify-jwt'
import { search } from './search.controller'
import { nearby } from './nearby.controller'
import { create } from './create.controller'
import { checkPermissions } from '../middlewares/check-permissions'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/gyms/search', search)

  app.get('/gyms/nearby', nearby)

  app.post('/gyms', { onRequest: [checkPermissions('ADMIN')] }, create)
}
