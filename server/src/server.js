const http = require("http");
const { app } = require("./app");
const { connectDb } = require("./config/db");
const { env } = require("./config/env");

async function bootstrap() {
  await connectDb(env.MONGO_URI);

  const server = http.createServer(app);
  server.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Fatal startup error:", err);
  process.exit(1);
});

