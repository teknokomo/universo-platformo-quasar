/**
 * Auth Module
 * Handles Supabase authentication proxy for the NestJS backend.
 * All auth operations (login, register, logout, session check) go through here.
 */
import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { SupabaseStrategy } from './supabase.strategy'
import { SupabaseService } from './supabase.service'
import { AuthController } from './auth.controller'
import { AuthGuard } from './auth.guard'

@Module({
    imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
    controllers: [AuthController],
    providers: [SupabaseStrategy, SupabaseService, AuthGuard],
    exports: [AuthGuard, PassportModule, SupabaseService]
})
export class AuthModule {}
