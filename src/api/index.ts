import { FastifyInstance } from 'fastify';
import habit from '../api/habit/routes';
import day from '../api/day/routes';

export default async (app: FastifyInstance) => {
  app.register(habit, { prefix: 'habits' });
  app.register(day, { prefix: 'days' });
};
