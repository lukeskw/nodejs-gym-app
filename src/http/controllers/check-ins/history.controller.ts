import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchUserCheckInsHistoryService } from '@/services/factories/make-fetch-user-checkins-history-service'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const historyGymQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = historyGymQuerySchema.parse(request.query)

  const checkInHistory = await makeFetchUserCheckInsHistoryService()

  const { checkIns } = await checkInHistory.execute({
    userId: request.user.sub,
    page,
  })

  return reply.status(200).send({
    checkIns,
  })
}
