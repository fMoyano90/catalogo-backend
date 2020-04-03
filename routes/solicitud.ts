import { Router, Response, request, response } from "express";
import { verificaToken } from "../middlewares/autenticacion";
import { Solicitud } from "../models/solicitud.model";

const solicitudRoutes = Router();

// CREAR SOLICITUD
solicitudRoutes.post("/", [verificaToken], async (req: any, res: Response) => {
  let body = req.body;

  // EMITIR CORREOS

  Solicitud.create(body)
    .then(async solicitudDB => {
      res.json({
        ok: true,
        solicitud: solicitudDB
      });
    })
    .catch(err => {
      res.json(err);
    });
});

// LISTAR SOLICITUD POR AÑO
solicitudRoutes.get("/:anio", async (req: any, res: Response) => {
  let pagina = Number(req.query.pagina) || 1;
  let skip = pagina - 1;
  skip = skip * 10;

  let anio = req.params.anio;

  const solicitudes = await Solicitud.find({ anio: anio })
    .sort({ nombre: 1 })
    .limit(10)
    .skip(skip)
    .exec();

  res.json({
    ok: true,
    pagina,
    solicitudes
  });
});

export default solicitudRoutes;
