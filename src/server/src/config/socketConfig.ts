import { ServerOptions } from "socket.io";

const url = process.env.URL_FRONTEND || "http://localhost:3000";

const socketConfig: ServerOptions = {
  cors: {
    origin: url, // Thêm origin của client để cho phép CORS
    methods: ["GET", "POST"],
  },
  path: "/socket.io",
  serveClient: true, 
  adapter: undefined,
  parser: undefined,
  connectTimeout: 45000,
  connectionStateRecovery: {
    maxDisconnectionDuration: 2000,
    skipMiddlewares: true,
  },
  cleanupEmptyChildNamespaces: true,
};

export default socketConfig;
