import { Router, Response, request, response } from "express";
import { verificaToken } from "../middlewares/autenticacion";
import { Convenio } from "../models/convenio.model";

const convenioRoutes = Router();

// OBTENER EPPS CONVENIO POR TIPO
convenioRoutes.get("/:genero", async (req: any, res: Response) => {
  const tipo = req.params.tipo;
  const lugar = req.params.lugar;
  const genero = req.params.genero;
  const temporada = req.params.temporada;
  const cargo = req.params.cargo;

  const eppsConvenio = await Convenio.find({
    los_andes: true,
  });

  res.json({
    ok: true,
    eppsConvenio,
  });
});

// CREAR EPP CONVENIO
convenioRoutes.post("/", [verificaToken], async (req: any, res: Response) => {
  let body = req.body;
  Convenio.create(body)
    .then(async (eppDB) => {
      res.json({
        ok: true,
        eppConvenio: eppDB,
      });
    })
    .catch((err) => {
      res.json(err);
    });
});

// IMPORTAR CSV A BASE DE DATOS (PRODUCTOS)
convenioRoutes.post("/leercsv", (req: any, res: any) => {
  const mongodb = require("mongodb").MongoClient;
  const csvtojson = require("csvtojson");
  const csvFilePath = "assets/epps-convenio.csv";

  // let url = "mongodb://username:password@localhost:27017/";
  let url = "mongodb://localhost:27017/";

  csvtojson({
    delimiter: [";"],
  })
    .fromFile(csvFilePath)
    .then((csvData: any) => {
      mongodb.connect(
        url,
        { useNewUrlParser: true, useUnifiedTopology: true },
        (err: any, client: any) => {
          if (err) throw err;
          client
            .db("catalogo")
            .collection("convenios")
            .insertMany(csvData, (err: any, res: any) => {
              if (err) throw err;
              console.log(`Inserted: ${res.insertedCount} rows`);
              client.close();
            });
        }
      );
      res.json({
        status: 200,
        data: csvData,
      });
    });
});

export default convenioRoutes;
