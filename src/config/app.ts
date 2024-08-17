import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT, 10) || 4300,
  allowedOrigins: process.env.ALLOWED_ORIGINS.split(','),
  nodeEnv: process.env.NODE_ENV || 'development',
}));
