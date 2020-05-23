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
  let eppsConvenio =
    '<table style="border: 1px solid #333;">' +
    "<thead>" +
    "<th> Codigo </th>" +
    "<th> Epp </th>" +
    "<th> Talla </th>" +
    "<th> Cantidad </th>" +
    "</thead>";

  for (let epp of epps) {
    eppsConvenio +=
      "<tr>" +
      "<td>" +
      epp.codigo +
      "</td>" +
      "<td>" +
      epp.nombre +
      "</td>" +
      "<td>" +
      epp.talla +
      "</td>" +
      "<td>" +
      "1" +
      "</td>" +
      "</tr>";
  }

  eppsConvenio += "</table>";

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
      <p><b>Cargo Actual:</b> ${body.cargo_actual}</p>
      <p><b>Lugar de retiro:</b> ${body.lugar_retiro}</p>
      <p><b>Año:</b> ${body.anio}</p>
      <p><b>Temporada:</b> ${body.temporada}</p>
      <h3>2. Datos de la solicitud</h3>
      ${eppsConvenio}
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

// OBTENER ÚLTIMA SOLICITUD POR ID DE USUARIO Y TEMPORADA
solicitudRoutes.get(
  "/:usuarioID/:temporada",
  async (req: any, res: Response) => {
    let usuarioID = req.params.usuarioID;
    let temporada = req.params.temporada;

    let solicitud = await Solicitud.findOne({
      $and: [{ usuarioID: usuarioID }, { temporada: temporada }],
    }).sort({ anio: -1 });

    if (!solicitud) {
      return res.json({
        ok: true,
        solicitud: null,
      });
    }
    res.json({
      ok: true,
      solicitud: solicitud,
    });
  }
);

export default solicitudRoutes;
