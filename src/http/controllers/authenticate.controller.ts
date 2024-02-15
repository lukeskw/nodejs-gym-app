import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsException } from '@/services/exceptions/invalid-credentials.exception'
import { makeAuthService } from '@/services/factories/make-auth-service'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authBodySchema.parse(request.body)

  try {
    const auth = await makeAuthService()

    await auth.execute({
      email,
      password,
    })
  } catch (err) {
    if (err instanceof InvalidCredentialsException) {
      return reply.status(400).send({
        error: err.message,
      })
    }

    throw err
  }

  return reply.status(200).send()
}
