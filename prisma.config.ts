import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  // Migrate needs a direct (non-pooled) connection; the app itself uses the pooled
  // DATABASE_URL via the Neon driver adapter in lib/db.ts.
  datasource: {
    url: env('DATABASE_URL_UNPOOLED'),
  },
});
