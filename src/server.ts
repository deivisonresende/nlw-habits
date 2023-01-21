import Fastify from "fastify";
import cors from '@fastify/cors'
import routes from './api'

const app = Fastify()

app.register(cors)
app.register(routes)

app.listen({ port: 3333 }).then(() => console.log('HTTP server listening'))