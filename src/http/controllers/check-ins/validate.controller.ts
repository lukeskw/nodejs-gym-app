import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeValidateCheckInService } from '@/services/factories/make-validate-checkin-service'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateCheckInParamsSchema.parse(request.params)

  const validateCheckIn = await makeValidateCheckInService()

  await validateCheckIn.execute({
    checkInId,
  })

  return reply.status(204).send()
}
