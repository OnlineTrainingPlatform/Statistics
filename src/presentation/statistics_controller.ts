import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { User } from '../application/actors/user';
import { IGetAStatisticsResponse } from '../application/usecases/calculate_exercise_statistics_use_case';

export async function statisticsController(
  fastify: FastifyInstance,
  opts: any,
): Promise<void> {
  fastify.get(
    '/statistics/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as { id: string };
        const user = new User();
        await user
          .getStatistics({ id })
          .catch((error) => {
            reply.status(500).send(error);
          })
          .then((resolve: void | IGetAStatisticsResponse) => {
            const response = resolve as IGetAStatisticsResponse;

            if (response.statistics == undefined) {
              reply.status(404).send();
              return;
            } else {
              reply.status(200).send(response);
            }
          });
      } catch (error) {
        reply.status(500).send();
      }
    },
  );
}
