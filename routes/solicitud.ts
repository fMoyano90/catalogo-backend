import { Router, Response, request, response } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import { Solicitud } from '../models/solicitud.model';
import nodemailer from 'nodemailer';

const solicitudRoutes = Router();

// CREAR SOLICITUD
solicitudRoutes.post('/', [verificaToken], async (req: any, res: Response) => {
  let body = req.body;

  // EMITIR CORREOS
  var transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '5af772fd26f4a4',
      pass: '95176b25d32ae6',
    },
  });

  var mailOptions = {
    from: 'Remitente',
    to: 'f.moyano90@gmail.com',
    subject: 'Solicitud de Epp peridodo: ',
    html: '<b>Texto enviado desde Node</b> usando HTML',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).send(error.message);
    } else {
      console.log('Email enviado correctamente');
    }
  });

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

export default solicitudRoutes;
