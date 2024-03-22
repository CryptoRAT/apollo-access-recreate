import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import fastifyApollo from '@as-integrations/fastify'
import Fastify from 'fastify'
import { promises as fs } from 'fs'
import { fileURLToPath } from 'node:url'
import path from 'path'
import pino from 'pino'

// ---------------------------------
// Logger Setup
// ---------------------------------
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const logDirectory = path.join(__dirname, 'logs')
const fastifyLogFilePath = path.join(logDirectory, 'fastify.log')
const apolloLogFilePath = path.join(logDirectory, 'apollo.log')
const kodamaLogFilePath = path.join(logDirectory, 'kodama.log')

async function ensureLogDirectoryExists() {
    try {
        await fs.mkdir(logDirectory, { recursive: true })
        console.log('Logs directory ensured.')
    } catch (err) {
        console.error('Error ensuring logs directory exists:', err)
    }
}

await ensureLogDirectoryExists()
const fastifyTransports = pino.transport({
    targets: [
        {
            level: 'debug',
            target: 'pino/file',
            options: {
                destination: fastifyLogFilePath,
            },
        },
    ],
})

const apolloTransports = pino.transport({
    targets: [
        {
            level: 'debug',
            target: 'pino/file',
            options: {
                destination: apolloLogFilePath,
            },
        },
    ],
})
const kodamaTransports = pino.transport({
    targets: [
        {
            level: 'debug',
            target: 'pino/file',
            options: {
                destination: kodamaLogFilePath,
            },
        },
    ],
})

// @ts-ignore
const fastifyLogger = pino(fastifyTransports)
// @ts-ignore
const kodamaLogger = pino(kodamaTransports)
// @ts-ignore
const apolloLogger = pino(apolloTransports)

fastifyLogger.info({ level: fastifyLogger.level }, 'fastifyLogger.level')
kodamaLogger.info({ level: kodamaLogger.level }, 'kodamaLogger.level')
apolloLogger.info({ level: apolloLogger.level }, 'apolloLogger.level')

// ---------------------------------
// Environment Setup
// ---------------------------------
kodamaLogger.info('Determining environment')
const environment = process.env.NODE_ENV || 'development'
if (!environment || environment.trim() === '') {
    process.env.NODE_ENV = 'development'
}
kodamaLogger.info(`Runtime Environment: ${environment}`)

// ---------------------------------
// Fastify Setup
// ---------------------------------
const fastifyApp = Fastify({
    logger: fastifyLogger,
})

fastifyApp.get('/', function (request, reply) {
    fastifyApp.log.debug('request: ', request)
    reply.send({ hello: 'world' })
})

const typeDefs = `#graphql
type Book {
    title: String
    author: String
}

type Query {
    books: [Book]
}
`

const books = [
    {
        title: 'The Awakening',
        author: 'Kate Chopin',
    },
    {
        title: 'City of Glass',
        author: 'Paul Auster',
    },
]

const resolvers = {
    Query: {
        books: () => books,
    },
}

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
})

// ---------------------------------
// Startup all the servers.
// ---------------------------------
kodamaLogger.info('Starting Apollo server')
const { url } = await startStandaloneServer(apolloServer, {
    listen: { port: 4000 },
})

kodamaLogger.info(`🚀  Apollo Server ready at: ${url}`)
await fastifyApp.register(fastifyApollo(apolloServer))
kodamaLogger.info('Starting fastify server')
fastifyApp.listen({ port: 3000 }, function (err, address) {
    fastifyApp.log.debug('address: ', address)
    if (err) {
        fastifyApp.log.error(err)
        process.exit(1)
    }
    kodamaLogger.info(`🚀  Fastify Server ready at: ${address}`)
})

console.log('All servers started, check logs/*.logs for more details.')
