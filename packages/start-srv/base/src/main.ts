/**
 * NestJS application entry point
 * Universo Platformo - Start Backend
 */
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
        logger: ['error', 'warn', 'log']
    })

    // Global prefix for all API routes
    app.setGlobalPrefix('api/v1')

    // CORS configuration
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
