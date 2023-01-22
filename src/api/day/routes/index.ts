import { prisma } from '../../../lib/prisma';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import dayjs from 'dayjs';

export default async (app: FastifyInstance) => {
  app.get('/', async request => {
    const validator = z.object({
      date: z.coerce.date()
    });

    const { date } = validator.parse(request.query);
    const parsedDate = dayjs(date).startOf('day');
    const weekDay = parsedDate.get('day');

    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date
        },
        weekDays: {
          some: {
            week_day: weekDay
          }
        }
      }
    });

    const day = await prisma.day.findUnique({
      where: {
        date
      },
      include: {
        dayHabits: true
      }
    });

    const completedHabits = day?.dayHabits.map(({ habit_id }) => habit_id)

    return { 
      possibleHabits,
      completedHabits
    };
  });
};
