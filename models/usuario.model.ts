import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

const usuarioSchema = new Schema({
  sap: {
    type: Number,
    unique: true,
    required: [true, "El número de SAP es obligatorio"]
  },
  rut: {
    type: String,
    unique: true,
    required: [true, "El RUT es obligatorio"]
  },
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"]
  },
  genero: {
    type: String
  },
  estado_civil: {
    type: String
  },
  rol: {
    type: String
  },
  contrato: {
    type: String
  },
  aco: {
    type: String
  },
  nacimiento: {
    type: String
  },
  ingreso: {
    type: String
  },
  division: {
    type: String
  },
  centro_costo: {
    type: String
  },
  posicion: {
    type: String
  },
  div_pers: {
    type: String
  },
  funcion: {
    type: String
  },
  organizacion: {
    type: String
  },
  superintendencia: {
    type: String
  },
  gerencia: {
    type: String
  },
  regla_ppl: {
    type: String
  },
  previsiones: {
    type: String
  },
  salud: {
    type: String
  },
  calle: {
    type: String
  },
  villa: {
    type: String
  },
  ciudad: {
    type: String
  },
  comuna: {
    type: String
  },
  telefono: {
    type: String
  },
  region: {
    type: String
  },
  sindicato: {
    type: String
  },
  tipo_socio: {
    type: String
  },
  tipo_usuario: {
    type: String,
    default: "USER"
  },
  solictud_verano: {
    type: Number,
    default: null
  },
  solicitul_invierno: {
    type: Number,
    default: null
  }
});

usuarioSchema.method("compararSap", function(sap: number = 0): boolean {
  if (sap == this.sap) {
    return true;
  } else {
    return false;
  }
});

interface IUsuario extends Document {
  sap: number;
  rut: string;
  nombre: string;
  genero: string;
  estado_civil: string;
  rol: string;
  contrato: string;
  aco: string;
  nacimiento: string;
  ingreso: string;
  division: string;
  centro_costo: string;
  posicion: string;
  div_pers: string;
  funcion: string;
  organizacion: string;
  superintendencia: string;
  gerencia: string;
  regla_ppl: string;
  previsiones: string;
  salud: string;
  calle: string;
  villa: string;
  ciudad: string;
  comuna: string;
  telefono: string;
  region: string;
  sindicato: string;
  tipo_socio: string;
  tipo_usuario: string;
  solicitud_verano?: number;
  solicitud_invierno?: number;

  compararSap(sap: string): boolean;
}

export const Usuario = model<IUsuario>("Usuario", usuarioSchema);
