import Server from "./classes/server";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
// RUTAS
import userRoutes from "./routes/usuario";
import productoRoutes from "./routes/producto";
import buscadorRoutes from "./routes/buscador";
import solicitudRoutes from "./routes/solicitud";

const server = new Server();

// Configurar cabeceras y cors
server.app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, x-token, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// Body parser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

// File Upload
server.app.use(fileUpload({ useTempFiles: true }));

// Rutas de mi appnpm install @types/express-fileupload
server.app.use("/user", userRoutes);
server.app.use("/productos", productoRoutes);
server.app.use("/buscador", buscadorRoutes);
server.app.use("/solicitudes", solicitudRoutes);

// Conectar DB

mongoose.connect(
  "mongodb://localhost:27017/catalogo",
  // "mongodb+srv://HitCode:HITCODE4716@catalogoepp-4kv0t.mongodb.net/test?retryWrites=true&w=majority",
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
