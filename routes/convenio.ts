import { Router, Response, request, response } from "express";
import { verificaToken } from "../middlewares/autenticacion";
import { Convenio } from "../models/convenio.model";

const convenioRoutes = Router();

// OBTENER EPPS CONVENIO POR TIPO
convenioRoutes.get("/convenio/:tipo", async (req: any, res: Response) => {
  let pagina = Number(req.query.pagina) || 1;
  let skip = pagina - 1;
  skip = skip * 10;

  let params = req.params.tipo;
  let tipo = params.toString();

  console.log(tipo);

  const eppsConvenio = await Convenio.find({ tipo: tipo });

  res.json({
    ok: true,
    pagina,
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
