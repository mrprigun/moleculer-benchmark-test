const ApiService = require("moleculer-web");
const { ServiceBroker } = require("moleculer");
const HealthMiddleware = require("@r2d2bzh/moleculer-healthcheck-middleware");

const broker = new ServiceBroker({
  transporter: "nats://localhost:4222",
  maxCallLevel: 10,
  logger: {
    type: 'Pino',
    options: {
      // Logging level
      level: 'info',
      pino: {
        options: null,
        destination: "./moleculer.log",
      },
    },
  },
  tracing: {
    enabled: false,
    exporter: "Console",
    events: true,
    stackTrace: true,
    sampling: {
      rate: 1.0
    }
  },
  metrics: {
    // https://moleculer.services/docs/0.14/metrics.html#Prometheus
    enabled: true,
    reporter: [
      {
        type: 'Prometheus',
        options: {
          port: 3031,
          path: '/metrics',
        },
      },
      /*{
        type: 'StatsD',
        options: {
          // Server host
          host: 'localhost',
          // Server port
          port: 8125,
          // Maximum payload size.
          maxPayloadSize: 1300,
          // excludes
          excludes: ['moleculer.event.**'],
        },
      },*/
    ],
  },
  middlewares: [
    HealthMiddleware({
      port: 3040,
      readiness: {
        path: '/health/ready',
      },
      liveness: {
        path: '/health/live',
      },
    }),
  ],
  tracking: {
    enabled: true,
    shutdownTimeout: 25 * 1000,
  },
  retryPolicy: {
    enabled: true,
    retries: 2,
    delay: 100,
  },
});

broker.loadService("./local.service");
broker.createService({
  mixins: [ ApiService ]
});

broker.start();
