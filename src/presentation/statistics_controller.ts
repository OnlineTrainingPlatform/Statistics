import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { User } from '../application/actors/user';

export async function statisticsController(
  fastify: FastifyInstance,
  // eslint-disable-next-line
  opts: any,
): Promise<void> {
  fastify.get(
    '/exercises/:id/statistics',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as { id: string };
        const user = new User(opts.submission_api);

        if (!id) {
          reply.status(400).send();
          return;
        }

        const res = await user.getStatistics({ exercise_id: id });
        if (!res.statistics) {
          reply.status(404).send('No submissions found for statistics');
          return;
        }
        reply.status(200).send(res.statistics);
      } catch (error) {
        console.log(error);
        reply.status(500).send(error);
      }
    },
  );
}
