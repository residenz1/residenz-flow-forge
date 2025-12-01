import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.APP_PORT || '3000', 10),
  name: process.env.APP_NAME || 'residenz-backend',
  cors: {
    origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','),
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },
}));

export const databaseConfig = registerAs('database', () => ({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  name: process.env.DATABASE_NAME || 'residenz_db',
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  logging: process.env.DATABASE_LOGGING === 'true',
}));

export const redisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  db: parseInt(process.env.REDIS_DB || '0', 10),
}));

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'dev-secret-key',
  expiresIn: process.env.JWT_EXPIRATION || '24h',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
}));

export const otpConfig = registerAs('otp', () => ({
  length: parseInt(process.env.OTP_LENGTH || '6', 10),
  expirationMinutes: parseInt(process.env.OTP_EXPIRATION_MINUTES || '10', 10),
  maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || '5', 10),
}));

export const twilioConfig = registerAs('twilio', () => ({
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  phoneNumber: process.env.TWILIO_PHONE_NUMBER,
}));

export const stripeConfig = registerAs('stripe', () => ({
  apiKey: process.env.STRIPE_API_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  connectAccountId: process.env.STRIPE_CONNECT_ACCOUNT_ID,
}));

export const metamapConfig = registerAs('metamap', () => ({
  apiKey: process.env.METAMAP_API_KEY,
  webhookSecret: process.env.METAMAP_WEBHOOK_SECRET,
}));

export const prometeoConfig = registerAs('prometeo', () => ({
  apiKey: process.env.PROMETEO_API_KEY,
  apiUrl: process.env.PROMETEO_API_URL || 'https://api.prometeo.io',
}));

export const supabaseConfig = registerAs('supabase', () => ({
  url: process.env.SUPABASE_URL,
  key: process.env.SUPABASE_KEY,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
}));

export const rateLimitConfig = registerAs('rateLimit', () => ({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
}));

export const mercadopagoConfig = registerAs('mercadopago', () => ({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://api.mercadopago.com'
    : 'https://api.sandbox.mercadopago.com',
}));
