import { createApp } from "./app";
import { env } from "./config/env";
import { prisma } from "./db/prisma";

async function main() {
  const app = createApp();

  // Verify DB connection before accepting traffic
  await prisma.$connect();
  console.log("✅  Database connected");

  app.listen(env.PORT, () => {
    console.log(`🚀  Server running on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
  });
}

main().catch((err) => {
  console.error("❌  Failed to start server:", err);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received. Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});
