import fastify from 'fastify';
import { FetchSubmissionsApi } from './infrastructure';
import { statisticsController } from './presentation';
import * as dotenv from 'dotenv';

// Load the ".env" file from the root. Afterwards check all required environment bindings
const envResult = dotenv.config();
if (envResult.error != undefined) {
  console.log(`dotenv failed parsing the .env file ${envResult.error!}`);
}

if (process.env.API_PREFIX == undefined) {
  console.log("Missing environment variable 'API_PREFIX'");
  process.exit(1);
}

if (process.env.PORT == undefined) {
  console.log("Missing environment variable 'PORT'");
  process.exit(1);
}

if (process.env.HOST == undefined) {
  console.log("Missing environment variable 'HOST' defaulting to 'localhost'");
  process.env.HOST = 'localhost';
}

if (process.env.EXERCISE_API_BASE_ROUTE == undefined) {
  const defaultExercisesApiBaseRoute = process.env.HOST;
  console.log(
    "Missing environment variable 'SUBMISSIONS_API_BASE_ROUTE' and will default to HOST variable '" +
      process.env.HOST +
      "'",
  );
  process.env.VERIFIERS_API_BASE_ROUTE = defaultExercisesApiBaseRoute;
}

const server = fastify({
  logger: {
    level: 'info'
  }
});

server.addHook("onRequest", (request, reply, done) => {
  request.log.info({
    startTime: Date.now(),
    url: request.raw.url,
    id: request.id
  })
  done();
})

server.addHook('onResponse', (request, reply, done) => {
  request.log.info({
    url: request.raw.url,
    status: reply.raw.statusCode,
    endTime: Date.now()
  })
  done();
})

// Register the controllers
server.register(statisticsController, {
  prefix: process.env.API_PREFIX,
  // Construct the submissions API which uses fetch
  submission_api: new FetchSubmissionsApi(),
});

server.listen(
  { port: Number(process.env.PORT), host: process.env.HOST },
  (err: any, address: any) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  },
);
