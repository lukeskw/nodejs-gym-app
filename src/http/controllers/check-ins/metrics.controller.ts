import { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetUserMetricsService } from '@/services/factories/make-get-user-metrics-service'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const userMetrics = await makeGetUserMetricsService()

  const { checkInsCount } = await userMetrics.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({
    checkInsCount,
  })
}
