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

    const { user } = await auth.execute({
      email,
      password,
    })

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )

    return reply.status(200).send({
      token,
    })
  } catch (err) {
    if (err instanceof InvalidCredentialsException) {
      return reply.status(400).send({
        error: err.message,
      })
    }

    throw err
  }
}
