import { Schema, Document, model } from 'mongoose';

const productoSchema = new Schema({
    material: {
        type: String
    },
    nombre: {
        type: String
    },
    descripcion: {
        type: String
    },
    categoria: {
        type: String
    },
    genero: {
        type: String
    },
    medida: {
        type: String
    },
    img: {
        type: String
    },
    created: {
        type: Date
    }
});

productoSchema.pre<IProducto>('save', function( next ){
    this.created = new Date();
    next();
});

interface IProducto extends Document {
    material: string;
    nombre: string;
    descripcion: string;
    categoria: string;
    genero: string;
    medida: string;
    img: string;
    created: Date;
}


export const Producto = model<IProducto>('Producto', productoSchema)