/**
 * NestJS application entry point
 * Universo Platformo - Start Backend
 */
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import fastifyCookie from '@fastify/cookie'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
        logger: ['error', 'warn', 'log']
    })

    // Register cookie plugin so HTTP-only session cookies can be set and read
    await app.register(fastifyCookie as any)

    // Global prefix for all API routes
    app.setGlobalPrefix('api/v1')

    // CORS configuration — allow credentials (cookies) from the frontend origin
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:9000',
        credentials: true
    })

    const port = parseInt(process.env.PORT || '3000', 10)
    await app.listen(port, '0.0.0.0')

    console.log(`[main] Universo Platformo Start Backend running on port ${port}`)
}

bootstrap().catch((err) => {
    console.error('[main] Failed to start application:', err)
    process.exit(1)
})
