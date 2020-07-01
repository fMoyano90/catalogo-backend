import { Router, Response, request, response } from "express";
import { verificaToken } from "../middlewares/autenticacion";
import { Convenio } from "../models/convenio.model";

const convenioRoutes = Router();

// OBTENER TODOS LOS EPPS CONVENIO PAGINADOS
convenioRoutes.get("/listado/convenio", async (req: any, res: Response) => {
  let pagina = Number(req.query.pagina) || 1;
  let skip = pagina - 1;
  skip = skip * 10;

  const epps = await Convenio.find()
    .sort({ nombre: 1 })
    .limit(10)
    .skip(skip)
    .exec();

  res.json({
    ok: true,
    pagina,
    epps,
  });
});

// OBTENER EPP CONVENIO POR CODIGO
convenioRoutes.get("/busqueda/:busqueda", async (req: any, res: Response) => {
  let pagina = Number(req.query.pagina) || 1;
  let skip = pagina - 1;
  skip = skip * 10;

  const eppConvenio = req.params.busqueda.toString();
  var regex = new RegExp(eppConvenio, "i");

  const epps = await Convenio.find({})
    .or([{ codigo: regex }, { epp: regex }])
    .sort({ epp: 1 })
    .limit(10)
    .skip(skip)
    .exec();

  res.json({
    ok: true,
    pagina,
    epps,
  });
});

// OBTENER PRODUCTO POR ID
convenioRoutes.get("/obtener/epp/:id", async (req: any, res: Response) => {
  let id = req.params.id;
  const eppConvenio = await Convenio.findById(id, (err, convenioBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!convenioBD) {
      return res.status(400).json({
        ok: false,
        message: "No existe producto con esa ID",
        err,
      });
    }

    res.json({
      ok: true,
      convenioEpp: convenioBD,
    });
  });
});

// OBTENER EPPS CONVENIO POR TIPO
convenioRoutes.get(
  "/:tipo/:lugar/:genero/:temporada/:cargo",
  async (req: any, res: Response) => {
    const tipo = req.params.tipo;
    const lugar = req.params.lugar;
    const genero = req.params.genero;
    const temporada = req.params.temporada;
    const cargo: string = req.params.cargo;

    const eppsConvenio = await Convenio.find({
      $and: [
        { tipo: tipo },
        { [lugar]: "si" },
        { [genero]: "si" },
        { [temporada]: "si" },
        { [cargo]: "si" },
      ],
    });

    res.json({
      ok: true,
      eppsConvenio,
    });
  }
);

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

// EDITAR EPPS CONVENIO
convenioRoutes.put(
  "/editar/:id",
  [verificaToken],
  async (req: any, res: Response) => {
    let id = req.params.id;
    let body = req.body;

    Convenio.findByIdAndUpdate(id, body)
      .then(async (productoDB) => {
        res.json({
          ok: true,
          producto: productoDB,
        });
      })
      .catch((err) => {
        res.json(err);
      });
  }
);

// ELIMINAR EPPS CONVENIO POR ID
convenioRoutes.delete("/delete/:id", (req: any, res: Response) => {
  let id = req.params.id;
  Convenio.findByIdAndDelete(id, (err, eppEliminado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      eppEliminado,
    });
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
