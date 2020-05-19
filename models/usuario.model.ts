import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

const usuarioSchema = new Schema({
  sap: {
    type: Number,
    unique: true,
    required: [true, "El número de SAP es obligatorio"],
  },
  rut: {
    type: String,
    unique: true,
    required: [true, "El RUT es obligatorio"],
  },
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  genero: {
    type: String,
  },
  centro_costo: {
    type: String,
  },
  ubicacion: {
    type: String,
  },
  cargo: {
    type: String,
  },
  tipo_usuario: {
    type: String,
    default: "USER",
  },
});

usuarioSchema.method("compararSap", function (sap: number = 0): boolean {
  if (sap == this.sap) {
    return true;
  } else {
    return false;
  }
});

interface IUsuario extends Document {
  sap: string;
  rut: string;
  nombre: string;
  genero: string;
  centro_costo: string;
  ubicacion: string;
  cargo: string;
  tipo_usuario: string;

  compararSap(sap: string): boolean;
}

export const Usuario = model<IUsuario>("Usuario", usuarioSchema);
