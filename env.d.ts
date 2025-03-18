declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    POSTGRES_DB_URI: string;
    JWT_SECRET: string;
    COOKIE_SECRET: string;
    PORT: string;
    ALLOWED_ORIGIN: string;
  }
}
