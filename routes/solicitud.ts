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
    from: '"Codelco División Andina" <feedback@codelco.cl>',
    to: 'f.moyano90@gmail.com',
    subject: '✔ Solicitud de Epp peridodo: ' + body.temporada,
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

  // SOLICITUDES INVIERNO
  if (body.temporada == 'INVIERNO') {
    switch (body.ubicacion) {
      case 'MINA RAJO':
        solicitudMail = `
        <table style="border-collapse: collapse; width: 70%;">
          <thead>
              <tr>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Articulo</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Talla</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Cantidad</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp2}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall2}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp3}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall3}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp4}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall4}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp5}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall5}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp6}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall6}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp7}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall7}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp8}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall8}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp9}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall9}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
          </tbody>
      </table>
      `;
        break;

      case 'Mina Subterr.':
        solicitudMail = `
        <table style="border-collapse: collapse; width: 70%;">
          <thead>
              <tr>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Articulo</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Talla</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Cantidad</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp2}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall2}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp3}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall3}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp4}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall4}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp5}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall5}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp6}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall6}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp7}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall7}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp8}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall8}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp9}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall9}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
          </tbody>
      </table>
      `;
        break;

      case 'Concentrador':
        solicitudMail = `
        <table style="border-collapse: collapse; width: 70%;">
          <thead>
              <tr>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Articulo</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Talla</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Cantidad</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp2}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall2}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp3}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall3}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp4}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall4}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp5}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall5}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp6}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall6}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp7}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall7}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp8}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall8}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp9}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall9}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
          </tbody>
      </table>
      `;
        break;

      case 'Plan.Fil. A.Ind':
        solicitudMail = `
        <table style="border-collapse: collapse; width: 70%;">
          <thead>
              <tr>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Articulo</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Talla</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Cantidad</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp2}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall2}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp3}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall3}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp4}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall4}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp5}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall5}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp6}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall6}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp7}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall7}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp8}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall8}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
          </tbody>
      </table>
      `;
        break;

      case 'Saladillo':
        solicitudMail = `
        <table style="border-collapse: collapse; width: 70%;">
          <thead>
              <tr>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Articulo</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Talla</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Cantidad</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp2}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall2}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp3}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall3}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp4}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall4}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp5}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall5}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp6}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall6}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp7}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall7}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
          </tbody>
      </table>
      `;
        break;

      case 'Los Andes':
        solicitudMail = `
        <table style="border-collapse: collapse; width: 70%;">
          <thead>
              <tr>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Articulo</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Talla</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Cantidad</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp2}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall2}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp3}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall3}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
          </tbody>
      </table>
      `;
        break;

      case 'Huechun A.Ind.':
        solicitudMail = `
        <table style="border-collapse: collapse; width: 70%;">
          <thead>
              <tr>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Articulo</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Talla</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Cantidad</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp2}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall2}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp3}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall3}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp4}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall4}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp5}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall5}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp6}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall6}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp7}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall7}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
          </tbody>
      </table>
      `;
        break;
    }
  }

  // SOLICITUDES VERANO
  if (body.temporada == 'VERANO') {
    switch (body.ubicacion) {
      case 'MINA RAJO':
        solicitudMail = `
        <table style="border-collapse: collapse; width: 70%;">
          <thead>
              <tr>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Articulo</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Talla</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Cantidad</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp2}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall2}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp3}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall3}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp4}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall4}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp5}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall5}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
          </tbody>
      </table>
      `;
        break;

      case 'Mina Subterr.':
        solicitudMail = `
        <table style="border-collapse: collapse; width: 70%;">
          <thead>
              <tr>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Articulo</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Talla</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Cantidad</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp2}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall2}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp3}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall3}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp4}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall4}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp5}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall5}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp6}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall6}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
          </tbody>
      </table>
      `;
        break;

      case 'Concentrador':
        solicitudMail = `
        <table style="border-collapse: collapse; width: 70%;">
          <thead>
              <tr>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Articulo</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Talla</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Cantidad</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp2}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall2}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp3}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall3}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp4}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall4}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp5}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall5}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp6}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall6}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
          </tbody>
      </table>
      `;
        break;

      case 'Plan.Fil. A.Ind':
        solicitudMail = `
        <table style="border-collapse: collapse; width: 70%;">
          <thead>
              <tr>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Articulo</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Talla</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Cantidad</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp2}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall2}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp3}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall3}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp4}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall4}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
          </tbody>
      </table>
      `;
        break;

      case 'Saladillo':
        solicitudMail = `
        <table style="border-collapse: collapse; width: 70%;">
          <thead>
              <tr>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Articulo</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Talla</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Cantidad</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp2}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall2}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp3}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall3}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp4}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall4}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
          </tbody>
      </table>
      `;
        break;

      case 'Los Andes':
        solicitudMail = `
        <table style="border-collapse: collapse; width: 70%;">
          <thead>
              <tr>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Articulo</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Talla</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Cantidad</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
          </tbody>
      </table>
      `;
        break;

      case 'Huechun A.Ind.':
        solicitudMail = `
        <table style="border-collapse: collapse; width: 70%;">
          <thead>
              <tr>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Articulo</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Talla</th>
                  <th style="border: 1px solid #dddddd; text-align:left; padding: 8px;">Cantidad</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall1}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp2}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall2}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr>
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp3}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall3}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
              </tr> 
              <tr>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.epp4}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">${body.tall4}</td>
                  <td style="border: 1px solid #dddddd; text-align:left; padding: 8px;">1</td>
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
