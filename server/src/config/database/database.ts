import { Database } from './types' // this is the Database interface we defined earlier
import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

export const dialect = new PostgresDialect({
  pool: new Pool({
    database: 'stock-dashboard',
    host: 'localhost',
    user: 'postgres',
    password: 'docker',
    port: 5432,
    min: 0,
    max: 10,
  })
})

// Database interface is passed to Kysely's constructor, and from now on, Kysely 
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how 
// to communicate with your database.
export const db = new Kysely<Database>({
  dialect,
})