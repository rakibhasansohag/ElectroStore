import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error('MONGODB_URI not set');

declare global {
	var _mongoClientPromise: Promise<MongoClient> | undefined;
	var _mongoClient: MongoClient | undefined;
	var _mongoDb: Db | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
	// In dev, keep a global to avoid hot reload creating new connections
	if (!global._mongoClientPromise) {
		client = new MongoClient(uri);
		global._mongoClientPromise = client.connect();
		global._mongoClient = client;
	}
	clientPromise = global._mongoClientPromise;
} else {
	client = new MongoClient(uri);
	clientPromise = client.connect();
}

export async function getDb() {
	const client = await clientPromise;
	if (process.env.NODE_ENV === 'development' && global._mongoDb)
		return global._mongoDb;
	const db = client.db();
	if (process.env.NODE_ENV === 'development') global._mongoDb = db;
	return db;
}
