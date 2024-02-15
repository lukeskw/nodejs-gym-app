import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository'
import { authenticateService } from '@/services/authenticate.service'
import { InvalidCredentialsException } from '@/services/exceptions/invalid-credentials.exception'

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
    const usersRepository = PrismaUsersRepository()

    const auth = await authenticateService(usersRepository)

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
