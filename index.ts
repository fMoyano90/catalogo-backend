import Server from "./classes/server";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import userRoutes from "./routes/usuario";
import productoRoutes from "./routes/producto";

const server = new Server();
// Configurar CORS
server.app.use(cors({ origin: true, credentials: true }));

// Body parser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

// File Upload
server.app.use(fileUpload());

// Rutas de mi appnpm install @types/express-fileupload
server.app.use("/user", userRoutes);
server.app.use("/productos", productoRoutes);

// Conectar DB

mongoose.connect(
  "mongodb+srv://HitCode:HITCODE4716@catalogoepp-4kv0t.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true, useCreateIndex: true },
  err => {
    if (err) throw err;
    console.log("Base de datos ONLINE");
  }
);

// Levantar express
server.start(() => {
  console.log(`Servidor corriendo en puerto ${server.port}`);
});
