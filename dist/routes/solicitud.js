"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middlewares/autenticacion");
const solicitud_model_1 = require("../models/solicitud.model");
const nodemailer_1 = __importDefault(require("nodemailer"));
const solicitudRoutes = express_1.Router();
// CREAR SOLICITUD
solicitudRoutes.post("/", [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "307c9998ff3e29",
            pass: "a678b762fa04b8",
        },
    });
    const epps = body.epps;
    let eppsConvenio = '<table style="border: 1px solid #333;">' +
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
    let envioCorreo = yield transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            res.status(500).send(err.message);
        }
        else {
            res.status(200).send("Enviado correctamente");
        }
    });
    solicitud_model_1.Solicitud.create(body)
        .then((solicitudDB) => __awaiter(void 0, void 0, void 0, function* () {
        res.json({
            ok: true,
            solicitud: solicitudDB,
        });
    }))
        .catch((err) => {
        res.json(err);
    });
}));
// LISTAR SOLICITUD POR AÑO
solicitudRoutes.get("/:anio", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    let anio = req.params.anio;
    const solicitudes = yield solicitud_model_1.Solicitud.find({ anio: anio })
        .sort({ nombre: 1 })
        .limit(10)
        .skip(skip)
        .exec();
    res.json({
        ok: true,
        pagina,
        solicitudes,
    });
}));
// SOLICITUD POR ID
solicitudRoutes.get("/obtener/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    const solicitud = yield solicitud_model_1.Solicitud.findById(id, (err, solicitudBD) => {
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
}));
// OBTENER ÚLTIMA SOLICITUD POR ID DE USUARIO Y TEMPORADA
solicitudRoutes.get("/:usuarioID/:temporada", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let usuarioID = req.params.usuarioID;
    let temporada = req.params.temporada;
    let solicitud = yield solicitud_model_1.Solicitud.findOne({
        $and: [{ usuarioID: usuarioID }, { temporada: temporada }],
    }).sort({ anio: -1 });
    if (!solicitud) {
        return res.status(400).json({
            ok: false,
            solicitud: null,
        });
    }
    res.json({
        ok: true,
        solicitud: solicitud,
    });
}));
exports.default = solicitudRoutes;
