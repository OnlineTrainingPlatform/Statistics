export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      API_PREFIX: string;
      MONGO_CONNECTION_STRING: string;
      MONGO_DOCUMENT_NAME: string;
      MONGO_DB_NAME: string;
    }
  }
}
