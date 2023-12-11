import { Config } from 'drizzle-kit';
export default {
	schema: './src/lib/server/schema/*',
	out: './drizzle',
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env.DATABASE_URL!
	},
	schemaFilter: ['pollpy']
} satisfies Config;
