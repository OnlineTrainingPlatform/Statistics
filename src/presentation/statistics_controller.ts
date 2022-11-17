import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { User } from '../application/actors/user';
import { IGetAStatisticsResponse } from '../application/usecases/calculate_exercise_statistics_use_case';

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

        await user
          .getStatistics({ id })
          .then((resolve: void | IGetAStatisticsResponse) => {
            const response = resolve as IGetAStatisticsResponse;

            if (response.statistics == undefined) {
              reply.status(404).send();
              return;
            } else {
              reply.status(200).send(response);
            }
          })
          .catch((error) => {
            reply.status(500).send(error);
          });
      } catch (error) {
        reply.status(500).send(error);
      }
    },
  );
}
