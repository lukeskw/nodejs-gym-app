import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { registerService } from '@/services/register.service'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository'
import { UserAlreadyExistsException } from '@/services/exceptions/user-already-exists.exception'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const usersRepository = PrismaUsersRepository()

    const register = await registerService(usersRepository)

    await register.execute({
      name,
      email,
      password,
    })
  } catch (err) {
    if (err instanceof UserAlreadyExistsException) {
      return reply.status(409).send({
        error: err.message,
      })
    }

    throw err
  }

  return reply.status(201).send()
}
