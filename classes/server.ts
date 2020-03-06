import express from "express";

export default class Server {
  public app: express.Application;
  public port: number = 3001;

  constructor() {
    this.app = express();
  }

  start(callback: Function) {
    this.app.listen(process.env.PORT || 3001, function() {
      console.log("Servidor corriendo en puerto 3001 o " + process.env.PORT);
    });
  }
}
