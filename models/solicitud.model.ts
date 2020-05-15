import { Schema, model, Document } from 'mongoose';

const solicitudSchema = new Schema({
  usuarioID: {
    type: String,
    required: [true, 'El id del usuario es obligatorio'],
  },
  nombre: { type: String },
  rut: { type: String },
  sap: { type: String },
  funcion: { type: String },
  ubicacion: { type: String },
  centro_costo: { type: String },
  lugar_retiro: { type: String },
  epp1: { type: String },
  tall1: { type: String },
  cod1: { type: String },
  epp2: { type: String },
  tall2: { type: String },
  cod2: { type: String },
  epp3: { type: String },
  tall3: { type: String },
  cod3: { type: String },
  epp4: { type: String },
  tall4: { type: String },
  cod4: { type: String },
  epp5: { type: String },
  tall5: { type: String },
  cod5: { type: String },
  epp6: { type: String },
  tall6: { type: String },
  cod6: { type: String },
  epp7: { type: String },
  tall7: { type: String },
  cod7: { type: String },
  epp8: { type: String },
  tall8: { type: String },
  cod8: { type: String },
  epp9: { type: String },
  tall9: { type: String },
  cod9: { type: String },
  epp10: { type: String },
  tall10: { type: String },
  cod10: { type: String },
  epp11: { type: String },
  tall11: { type: String },
  cod11: { type: String },
  epp12: { type: String },
  tall12: { type: String },
  cod12: { type: String },
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
  centro_costo: string;
  lugar_retiro: string;
  epp1: string;
  tall1: string;
  cod1: string;
  epp2: string;
  tall2: string;
  cod2: string;
  epp3: string;
  tall3: string;
  cod3: string;
  epp4: string;
  tall4: string;
  cod4: string;
  epp5: string;
  tall5: string;
  cod5: string;
  epp6: string;
  tall6: string;
  cod6: string;
  epp7: string;
  tall7: string;
  cod7: string;
  epp8: string;
  tall8: string;
  cod8: string;
  epp9: string;
  tall9: string;
  cod9: string;
  epp10: string;
  tall10: string;
  cod10: string;
  epp11: string;
  tall11: string;
  cod11: string;
  epp12: string;
  tall12: string;
  cod12: string;
  temporada: string;
  anio: number;
  mes: number;
}

export const Solicitud = model<ISolicitud>('Solicitud', solicitudSchema);
