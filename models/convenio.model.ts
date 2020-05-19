import { Schema, Document, model } from "mongoose";

const productoSchema = new Schema({
  codigo: { type: Number },
  epp: { type: String },
  salacom: { type: String },
  los_andes: { type: String },
  huechun: { type: String },
  saladillo: { type: String },
  planta_filtro: { type: String },
  hombre: { type: String },
  mujer: { type: String },
  verano: { type: String },
  invierno: { type: String },
  mecanico: { type: String },
  electrico: { type: String },
  general: { type: String },
  añoxmedio: { type: String },
  tipo: { type: String },
  talla: { type: String },
});

interface IConvenio extends Document {
  codigo: string;
  epp: string;
  salacom: string;
  los_andes: string;
  huechun: string;
  saladillo: string;
  planta_filtro: string;
  hombre: string;
  mujer: string;
  verano: string;
  invierno: string;
  mecanico: string;
  electrico: string;
  general: string;
  añoxmedio: string;
  tipo: string;
  talla: string;
}

export const Convenio = model<IConvenio>("Convenio", productoSchema);
