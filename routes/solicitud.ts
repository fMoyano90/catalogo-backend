import { Router, Response, request, response } from "express";
import { verificaToken } from "../middlewares/autenticacion";
import { Solicitud } from "../models/solicitud.model";
import nodemailer from "nodemailer";

const solicitudRoutes = Router();

// CREAR SOLICITUD
solicitudRoutes.post("/", [verificaToken], async (req: any, res: Response) => {
  let body = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "307c9998ff3e29",
      pass: "a678b762fa04b8",
    },
  });

  const epps = body.epps;
  var mailOptions = {
    from: '"Codelco División Andina" <feedback@codelco.cl>',
    to: "f.moyano90@gmail.com",
    subject: "✔ Solicitud de Epp peridodo: " + body.temporada,
    html: `
      <p>Se ha emitido una nueva solicitud de EPP para el periodo.</p>
      <h3>1. Datos del trabajador</h3>
      <p><b>Nombre:</b> ${body.nombre}</p>
      <p><b>Rut:</b> ${body.rut}</p>
      <p><b>Sap:</b> ${body.sap}</p>
      <p><b>Función:</b> ${body.funcion}</p>
      <p><b>Ubicación:</b> ${body.ubicacion}</p>
      <p><b>Año:</b> ${body.anio}</p>
      <p><b>Temporada:</b> ${body.temporada}</p>
      <h3>2. Datos de la solicitud</h3>

      ${epps[0].nombre}, ${epps[0].talla}, ${epps[0].codigo}
      ${epps[1].nombre}, ${epps[1].talla}, ${epps[1].codigo}
      ${epps[2].nombre}, ${epps[2].talla}, ${epps[2].codigo}
      ${epps[3].nombre}, ${epps[3].talla}, ${epps[3].codigo}
      ${epps[4].nombre}, ${epps[4].talla}, ${epps[4].codigo}
      ${epps[5].nombre}, ${epps[5].talla}, ${epps[5].codigo}
      ${epps[6].nombre}, ${epps[6].talla}, ${epps[6].codigo}
      ${epps[7].nombre}, ${epps[7].talla}, ${epps[7].codigo}
      ${epps[8].nombre}, ${epps[8].talla}, ${epps[8].codigo}
      ${epps[9].nombre}, ${epps[9].talla}, ${epps[9].codigo}
      ${epps[10].nombre}, ${epps[10].talla}, ${epps[10].codigo}
      `,
  };

  let envioCorreo = await transporter.sendMail(
    mailOptions,
    (err: any, info: any) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.status(200).send("Enviado correctamente");
      }
    }
  );

  Solicitud.create(body)
    .then(async (solicitudDB) => {
      res.json({
        ok: true,
        solicitud: solicitudDB,
      });
    })
    .catch((err) => {
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
    solicitudes,
  });
});

// SOLICITUD POR ID
solicitudRoutes.get("/obtener/:id", async (req: any, res: Response) => {
  let id = req.params.id;
  const solicitud = await Solicitud.findById(id, (err, solicitudBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!solicitudBD) {
      return res.status(400).json({
        ok: false,
        message: "No existe una solicitud con esa ID",
        err,
      });
    }

    res.json({
      ok: true,
      solicitud: solicitudBD,
    });
  });
});

// SOLICITUDES INVIERNO

export default solicitudRoutes;
