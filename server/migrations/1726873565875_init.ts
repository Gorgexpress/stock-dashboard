import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
    .createTable('watchlist')
    .addColumn('symbol', 'varchar', (col) => col.primaryKey())
    .addColumn('added_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute()
  await db.schema
    .createTable('symbol')
    .addColumn('symbol', 'varchar', (col) => col.primaryKey())
    .addColumn('name', 'varchar', (col) => col)
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('watchlist').execute()
  await db.schema.dropTable('symbol').execute()
}
