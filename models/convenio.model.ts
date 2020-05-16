import { Schema, Document, model } from "mongoose";

const productoSchema = new Schema({
  codigo: { type: Number },
  epp: { type: String },
  salacom: { type: Boolean },
  los_andes: { type: Boolean },
  huechun: { type: Boolean },
  saladillo: { type: Boolean },
  planta_filtro: { type: Boolean },
  hombre: { type: Boolean },
  mujer: { type: Boolean },
  verano: { type: Boolean },
  invierno: { type: Boolean },
  mecanico: { type: Boolean },
  electrico: { type: Boolean },
  general: { type: Boolean },
  añoxmedio: { type: Boolean },
  tipo: { type: String },
  talla: { type: Number },
});

interface IConvenio extends Document {
  codigo: string;
  epp: string;
  salacom: boolean;
  los_andes: boolean;
  huechun: boolean;
  saladillo: boolean;
  planta_filtro: boolean;
  hombre: boolean;
  mujer: boolean;
  verano: boolean;
  invierno: boolean;
  mecanico: boolean;
  electrico: boolean;
  general: boolean;
  añoxmedio: boolean;
  tipo: string;
  talla: any;
}

export const Convenio = model<IConvenio>("Convenio", productoSchema);
