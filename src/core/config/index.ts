export interface AppConfig {
  ENV: string;
  NAME: string;
  PORT: string | number;
  BASE_URL: string;
}
export interface DBConfig {
  DB_HOST: string;
  DB_USER_NAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_PORT: number | string;
}

export interface GITHUBConfig {
  GITHUB_CLIENT_ID: string;
  GITHUB_SECRET_KEY: string;
}

export interface Configurations {
  APP: AppConfig;
  DB: DBConfig;
  GITHUB: GITHUBConfig;
}
