import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

const dbUrl = process.env.DATABASE_URL || "postgresql://postgres:Hotfix%4012345%40@db.cqsyyyfkrdpednbjnulg.supabase.co:5432/postgres";

export const pool = new Pool({ connectionString: dbUrl });
export const db = drizzle(pool, { schema });
