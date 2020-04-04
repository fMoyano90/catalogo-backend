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
  periodo: { type: String },
  epp1: { type: String },
  tall1: { type: String },
  epp2: { type: String },
  tall2: { type: String },
  epp3: { type: String },
  tall3: { type: String },
  epp4: { type: String },
  tall4: { type: String },
  epp5: { type: String },
  tall5: { type: String },
  epp6: { type: String },
  tall6: { type: String },
  epp7: { type: String },
  tall7: { type: String },
  epp8: { type: String },
  tall8: { type: String },
  epp9: { type: String },
  tall9: { type: String },
  epp10: { type: String },
  tall10: { type: String },
  epp11: { type: String },
  tall11: { type: String },
  epp12: { type: String },
  tall12: { type: String },
  epp13: { type: String },
  tall13: { type: String },
  epp14: { type: String },
  tall14: { type: String },
  epp15: { type: String },
  tall15: { type: String },
  temporada: { type: String },
  anio: { type: Number },
  mes: { type: Number },
});

interface ISolicitud extends Document {
  usuarioID: string;
  nombre: string;
  rut: string;
  sap: string;
  funcion: string;
  ubicacion: string;
  periodo: string;
  epp1: string;
  tall1: string;
  epp2: string;
  tall2: string;
  epp3: string;
  tall3: string;
  epp4: string;
  tall4: string;
  epp5: string;
  tall5: string;
  epp6: string;
  tall6: string;
  epp7: string;
  tall7: string;
  epp8: string;
  tall8: string;
  epp9: string;
  tall9: string;
  epp10: string;
  tall10: string;
  epp11: string;
  tall11: string;
  epp12: string;
  tall12: string;
  epp13: string;
  tall13: string;
  epp14: string;
  tall14: string;
  epp15: string;
  tall15: string;
  temporada: string;
  anio: number;
  mes: number;
}

export const Solicitud = model<ISolicitud>("Solicitud", solicitudSchema);
