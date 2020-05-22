import { Schema, model, Document } from "mongoose";

const solicitudSchema = new Schema({
  usuarioID: {
    type: String,
    required: [true, "El id del usuario es obligatorio"],
  },
  nombre: { type: String },
  rut: { type: String },
  sap: { type: String },
  funcion: { type: String },
  ubicacion: { type: String },
  centro_costo: { type: String },
  lugar_retiro: { type: String },
  cargo_actual: { type: String },
  epps: { type: [] },
  temporada: { type: String },
  mes: { type: Number },
  anio: { type: Number },
});

interface Epp {
  codigo: number;
  nombre: string;
  talla: string;
}

interface ISolicitud extends Document {
  usuarioID: string;
  nombre: string;
  rut: string;
  sap: string;
  funcion: string;
  ubicacion: string;
  centro_costo: string;
  lugar_retiro: string;
  cargo_actual: string;
  epps: Epp[];
  temporada: string;
  anio: number;
  mes: number;
}

export const Solicitud = model<ISolicitud>("Solicitud", solicitudSchema);
