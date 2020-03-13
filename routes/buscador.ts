import { Router, Response, request, response } from "express";
import { verificaToken } from "../middlewares/autenticacion";
import { Producto } from "../models/producto.model";
import { FileUpload } from "../interfaces/file-upload";
import FileSystem from "../classes/file-system";

const buscadorRoutes = Router();
const fileSystem = new FileSystem();

buscadorRoutes.get("/", (req: any, res: Response) => {
    res.json({
        ok: true, 
        message: "ruta de prueba"
    })
});


// Obtener producto por busqueda
buscadorRoutes.get("/:busqueda", async (req: any, res: Response) => {
  let pagina = Number(req.query.pagina) || 1;
  let skip = pagina - 1;
  skip = skip * 10;

  let busqueda = req.params.busqueda;
  var regex = new RegExp(busqueda, "i");

  const productos = await Producto.find({}, "material descripcion")
    .or([{ descripcion: regex }, { material: regex }])
    .sort({ nombre: 1 })
    .limit(10)
    .skip(skip)
    .exec();

  res.json({
    ok: true,
    pagina,
    productos
  });
});

export default buscadorRoutes;
