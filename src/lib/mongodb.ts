
import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || process.env.MONGODB_URL;
if (!uri) throw new Error('MONGODB_URI or MONGODB_URL not set in .env');

const dbNameFromEnv = process.env.MONGODB_DB;

declare global {
	var _mongoClientPromise: Promise<MongoClient> | undefined;
	var _mongoClient: MongoClient | undefined;
	var _mongoDb: Db | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
	if (!global._mongoClientPromise) {
		const client = new MongoClient(uri);
		global._mongoClientPromise = client.connect();
		global._mongoClient = client;
	}
	clientPromise = global._mongoClientPromise!;
} else {
	const client = new MongoClient(uri);
	clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
	const client = await clientPromise;

	// if MONGODB_DB is set, use that explicit DB; otherwise rely on the DB in the URI (or driver default)
	const db = dbNameFromEnv ? client.db(dbNameFromEnv) : client.db();

	if (process.env.NODE_ENV === 'development') {
		global._mongoDb = db;
	}

	// helpful debug log when developing
	console.log('MongoDB connected to DB:', db.databaseName);
	return db;
}
