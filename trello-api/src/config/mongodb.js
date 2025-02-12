import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from './environments'

let trelloDatabaseInstance = null
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

// connect to database
export const CONNECT_DB = async () => {
    await mongoClientInstance.connect()

    trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

export const GET_DB = () => {
    if (!trelloDatabaseInstance) throw new Error('Must connect to Database first')

    return trelloDatabaseInstance
}

export const CLOSE_DB = async () => {
    await mongoClientInstance.close()
}