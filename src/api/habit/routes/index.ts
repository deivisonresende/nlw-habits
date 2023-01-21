import { prisma } from '../../../lib/prisma';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import dayjs from 'dayjs'

export default async (app: FastifyInstance) => {
  app.post('/', async request => {
    const validator = z.object({
      title: z.string(),
      weekDays: z.array(z.number().min(0).max(6))
    });

    const { title, weekDays } = validator.parse(request.body);

    await prisma.habit.create({
      data: {
        title: title,
        created_at: dayjs().startOf('day').toDate(),
        weekDays: {
          create: weekDays.map(day => ({ week_day: day })),
        }
      }
    })
  });
};
