import { Router, Request, Response } from "express";
import { Usuario } from "../models/usuario.model";
import bcrypt from "bcrypt";
import Token from "../classes/token";
import { verificaToken } from "../middlewares/autenticacion";

const userRoutes = Router();
userRoutes.post("/login", (req: Request, res: Response) => {
  const body = req.body;

  Usuario.findOne({ email: body.email }, (err, userDB) => {
    if (err) throw err;

    if (!userDB) {
      return res.json({
        ok: false,
        mensaje: "Usuario o contraseña no son correctos"
      });
    }

    if (userDB.compararPassword(body.password)) {
      const tokenUser = Token.getJwtToken({
        _id: userDB._id,
        nombre: userDB.nombre,
        email: userDB.email,
        avatar: userDB.avatar,
        role: userDB.role
      });

      res.json({
        ok: true,
        token: tokenUser
      });
    } else {
      return res.json({
        ok: false,
        mensaje: "Usuario o contraseña no son correctos"
      });
    }
  });
});

userRoutes.post("/create", (req: Request, res: Response) => {
  const user = {
    nombre: req.body.nombre,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    role: req.body.role,
    sap: req.body.sap,
    rut: req.body.rut,
    avatar: req.body.avatar
  };

  Usuario.create(user)
    .then(userDB => {
      res.json({
        ok: true,
        user: userDB
      });
    })
    .catch(err => {
      res.json({
        ok: false,
        err
      });
    });
});

// Actualizar usuario
userRoutes.post("/update", verificaToken, (req: any, res: Response) => {
  const user = {
    nombre: req.body.nombre || req.usuario.nommbre,
    email: req.body.email || req.usuario.email,
    avatar: req.body.avatar || req.usuario.avatar,
    role: req.body.role || req.usuario.role
  };

  Usuario.findByIdAndUpdate(
    req.usuario._id,
    user,
    { new: true },
    (err, userDB) => {
      if (err) throw err;

      if (!userDB) {
        return res.json({
          ok: false,
          mensaje: "No existe un usuario con ese ID"
        });
      }

      const tokenUser = Token.getJwtToken({
        _id: userDB._id,
        nombre: userDB.nombre,
        email: userDB.email,
        avatar: userDB.avatar,
        role: userDB.role
      });

      res.json({
        ok: true,
        token: tokenUser
      });
    }
  );
});

userRoutes.get("/", [verificaToken], (req: any, res: Response) => {
  const usuario = req.usuario;

  res.json({
    ok: true,
    usuario
  });
});

// Obtener usuarios paginados
userRoutes.get("/all", [verificaToken], async (req: any, res: Response) => {
  let pagina = Number(req.query.pagina) || 1;
  let skip = pagina - 1;
  skip = skip * 10;

  const usuarios = await Usuario.find()
    .sort({ nombre: 1 })
    .limit(10)
    .skip(skip)
    .exec();

  res.json({
    ok: true,
    pagina,
    usuarios
  });
});

export default userRoutes;
