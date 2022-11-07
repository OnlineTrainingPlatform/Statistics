import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import mongoose from 'mongoose';

export async function statusController(
  fastify: FastifyInstance,
  opts: any,
): Promise<void> {
  fastify.get(
    '/status',
    async (request: FastifyRequest, reply: FastifyReply) => {
      // 0: disconnected
      // 1: connected
      // 2: connecting
      // 3: disconnecting
      const readyState = mongoose.connection.readyState;
      // We have connected to the database
      if (readyState === 1) {
        reply.status(200).send('OK');
      } else if (readyState == 2) {
        reply.status(202).send('Working on it');
      } else {
        reply.status(500).send('Bad');
      }
    },
  );
}
