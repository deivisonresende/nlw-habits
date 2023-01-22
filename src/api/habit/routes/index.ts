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

  app.patch('/:id/toggle', async (request, reply) => {
    const validator = z.object({
      id: z.string().uuid()
    });

    const { id } = validator.parse(request.params);

    const today = dayjs().startOf('day').toDate();

    let day = await prisma.day.findUnique({
      where: {
        date: today
      }
    });

    const habitWeekDays = await prisma.habitWeekDays.findMany({
      where: {
        habit_id: id
      }
    })
 
    const isHabitAvailableToday = habitWeekDays.some(({ week_day}) => week_day === today.getDay())

    if(!isHabitAvailableToday) return reply.status(400).send({
      message: 'Hábito não disponível para para este dia da semana'
    })

    if(!day){
      day = await prisma.day.create({
        data: {
          date: today
        }
      })
    }

    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: day.id,
          habit_id: id
        }
      }
    })

    if(dayHabit){
      await prisma.dayHabit.delete({
        where: {
          id: dayHabit.id
        }
      })
    } else {
      await prisma.dayHabit.create({
        data: {
          day_id: day.id,
          habit_id: id
        }
      })
    }
  });

  app.get('/summary', async (request) => {
    const summary = await prisma.$queryRaw`
      SELECT 
        D.id, 
        D.date,
        (
          SELECT 
            cast(count(*) as float)
          FROM day_habit DH
          WHERE DH.day_id = D.id
        ) as completed,
        (
          SELECT 
            cast(count(*) as float)
          FROM habit_week_days HDW
          JOIN habits H
            ON H.id = HDW.habit_id
          WHERE 
            HDW.week_day = cast(strftime('%w', D.date / 1000, 'unixepoch') as int)
            AND
              H.created_at <= D.date
        ) as amount
      FROM days D
    `

    return summary
  })
}; 
