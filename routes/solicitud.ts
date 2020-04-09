import { Router, Response, request, response } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import { Solicitud } from '../models/solicitud.model';
import nodemailer from 'nodemailer';

const solicitudRoutes = Router();

// CREAR SOLICITUD
solicitudRoutes.post('/', [verificaToken], async (req: any, res: Response) => {
  let body = req.body;

  // EMITIR CORREOS
  let solicitudMail = await definirSolicitud(body);

  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '5af772fd26f4a4',
      pass: '95176b25d32ae6',
    },
  });

  var mailOptions = {
    from: '"FElIPE DEV 👻" <foo@example.com>',
    to: 'f.moyano90@gmail.com',
    subject: '✔ Solicitud de Epp peridodo: ' + body.temporada,
    html: `
      <p>Se ha emitido una nueva solicitud de EPP para el periodo.</p>
      <h3>1. Datos del usuario</h3>
      <p><b>Nombre:</b> ${body.nombre}</p>
      <p><b>Rut:</b> ${body.rut}</p>
      <p><b>Sap:</b> ${body.sap}</p>
      <p><b>Función:</b> ${body.funcion}</p>
      <p><b>Ubicación:</b> ${body.ubicacion}</p>
      <p><b>Año:</b> ${body.anio}</p>
      <p><b>Temporada:</b> ${body.temporada}</p>
      <h3>2. Datos de la solicitud</h3>
      ${solicitudMail}
      `,
  };

  let envioCorreo = await transporter.sendMail(
    mailOptions,
    (err: any, info: any) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.status(200).send('Enviado correctamente');
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
solicitudRoutes.get('/:anio', async (req: any, res: Response) => {
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
solicitudRoutes.get('/obtener/:id', async (req: any, res: Response) => {
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
        message: 'No existe una solicitud con esa ID',
        err,
      });
    }

    res.json({
      ok: true,
      solicitud: solicitudBD,
    });
  });
});

function definirSolicitud(body: any) {
  var solicitudMail = '';
  if (body.temporada == 'INVIERNO') {
    switch (body.ubicacion) {
      case 'Los Andes':
        solicitudMail = `
        <table>
          <thead>
              <tr>
                  <th>Articulo</th>
                  <th>Talla</th>
                  <th>Cantidad</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td>${body.epp1}</td>
                  <td>${body.tall1}</td>
                  <td>1</td>
              </tr>
              <tr>
                  <td>${body.epp2}</td>
                  <td>${body.tall2}</td>
                  <td>1</td>
              </tr>
              <tr>
                  <td>${body.epp3}</td>
                  <td>${body.tall3}</td>
                  <td>1</td>
              </tr> 
          </tbody>
      </table>
      `;
        break;
    }
  }
  return solicitudMail;
}

export default solicitudRoutes;
