import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

const usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"]
  },
  avatar: {
    type: String,
    default: "av-1.png"
  },
  role: {
    type: String,
    default: "USER"
  },
  email: {
    type: String,
    unique: true,
    required: [true, "El correo es necesario"]
  },
  sap: {
    type: String,
    unique: true,
    required: [true, "El número de SAP es obligatorio"]
  },
  rut: {
    type: String,
    unique: true,
    required: [true, "El RUT es obligatorio"]
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"]
  }
});

usuarioSchema.method("compararPassword", function(
  password: string = ""
): boolean {
  if (bcrypt.compareSync(password, this.password)) {
    return true;
  } else {
    return false;
  }
});

interface IUsuario extends Document {
  nombre: string;
  email: string;
  sap: string;
  password: string;
  avatar: string;
  role: string;

  compararPassword(password: string): boolean;
}

export const Usuario = model<IUsuario>("Usuario", usuarioSchema);
