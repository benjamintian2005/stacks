import { PrismaClient } from './generated/prisma';
import { PrismaNeon } from '@prisma/adapter-neon';

// Lazy singleton: constructing the adapter touches DATABASE_URL, which isn't set at build time
// (e.g. before the Neon integration is provisioned). Evaluating it eagerly at module scope would
// crash `next build`. Avoid wrapping this in a Proxy — that breaks libraries that introspect the
// client object (property checks, etc.).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createDb() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter });
}

export function getDb(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createDb();
  }
  return globalForPrisma.prisma;
}
