import { ZodError } from "zod";
import { VentaModel } from "../models/ventas.model.js"
import { crearVentaSchema } from "../schemas/venta.schema.js";
import { UserPayload } from "../types/user.js";
import { Venta, VentaUsuario } from "../types/venta.js"
import { AppError } from "../utils/AppError.js";
import ProductoModel from "../models/producto.model.js";

const VentaService = {
  
  // Listar todas las ventas
  listarVentas: async (): Promise<Venta[]> => {
    return await VentaModel.getAll();
  },

  // Obtener una venta por su ID
  obtenerVentaId: async (id: string | string[] | undefined): Promise<Venta> => {
    const idNum = Number(id);
    if(isNaN(idNum)) throw new AppError("ID de venta no valido", 400);

    const venta = await VentaModel.getById(idNum);
    if(!venta) throw new AppError("Venta no encontrada", 404);

    return venta;
  },

  // Crear una nueva venta
  crearVenta: async (datosVenta: {producto_id: number, cantidad: number}, userLogueado: UserPayload): Promise<{id: number, total: number}> => {
    try {
      crearVentaSchema.parse(datosVenta);
    } catch (error: unknown) {
      if(error instanceof ZodError) {
        const errorMessage = error.issues.length > 0
          ? error.issues[0]?.message
          : "Error desconocido en la validacion de la venta.";
        throw new AppError(`Error de validacion: ${errorMessage}`, 400);
      } else {
        throw new AppError(`Error inesperado durante la validacion de la venta.`, 500);
      }
    }

    const {producto_id, cantidad} = datosVenta;
    const usuario_id = userLogueado.id;

    // Verificamos que el producto exista y este activo
    const producto = await ProductoModel.getById(producto_id);
    if(!producto) throw new AppError("Producto no encontrado o inactivo", 404);

    // Verificamos el stock disponible
    if(producto.stock < cantidad) {
      throw new AppError(`Stock insuficiente para el producto '${producto.nombre}'. Disponible: ${producto.stock}`, 400);
    }

    // Calculamos precio_unidad y total
    const precio_unidad = producto.precio;
    const total = precio_unidad * cantidad;

    // Creamos la venta en el modelo
    const nuevaVenta = await VentaModel.create({
      producto_id,
      usuario_id,
      cantidad,
      precio_unidad,
      total
    });

    return {id: nuevaVenta.id, total};
  },

  // Obtener reporte de ventas agrupados por usuario
  getReportSalesByUser: async (userLogueado: UserPayload): Promise<VentaUsuario[]> => {
    if(!userLogueado || userLogueado.rol !== 'admin') {
      throw new AppError("No tienes permiso para acceder a los reportes de ventas.", 403);
    }
    
    return await VentaModel.getSalesByUser();
  }

  // Agregar las adelante los services: cancelarVenta o generarReporte
}

export default VentaService