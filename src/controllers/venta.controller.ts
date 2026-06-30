import { Request, Response, NextFunction } from "express"
import VentaService from "../services/venta.service.js"

// Controller para listar todas las ventas
export const listarVentas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ventas = await VentaService.listarVentas();

    res.status(200).json({
      mensaje: ventas.length > 0 ? "Lista de ventas obtenidas correctamente" : "No hay ventas registradas",
      cantidad_ventas: ventas.length,
      datos: ventas
    });
  } catch (err: any) {
    next(err);
  }
};

// Controller para obtener una venta por ID
export const obtenerVentaId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const venta = await VentaService.obtenerVentaId(id);

    res.status(200).json({
      mensaje: "Venta encontrada",
      datos: venta
    });
  } catch (err: any) {
    next(err);
  }
};

// Controller para crear una venta
export const crearVenta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {producto_id, cantidad} = req.body;

    const nuevaVenta = await VentaService.crearVenta({producto_id, cantidad}, req.user!);

    res.status(201).json({
      mensaje: "Venta registrada con exito",
      id_venta: nuevaVenta.id,
      total_venta: nuevaVenta.total,
      producto_id: producto_id,
      cantidad: cantidad
    })
  } catch (err: any) {
    next(err);
  }
}

// Controller para obtener el reporte de ventas por usuario
export const getSalesByUserReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await VentaService.getReportSalesByUser(req.user!);

    res.status(200).json({
      mensaje: report.length > 0 ? "Report de ventas por usuario obtenido correctamente" : "No hay datos de ventas para el reporte",
      datos: report
    });
  } catch (err: any) {
    next(err);
  }
}

// Controller para obtener el reporte de ventas por producto
export const getSalesByProductReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await VentaService.getReportSalesByProduct(req.user!);

    res.status(200).json({
      mensaje: report.length > 0 ? "Reporte de ventas por producto obtenido correctamente" : "No hay datos de ventas por producto para el reporte",
      datos: report
    });
  } catch (err: any) {
    next(err);
  }
};

// Controller para cancelar una venta
export const cancelarVenta = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const resultado = await VentaService.cancelarVenta(id, req.user!)

    res.status(200).json({
      mensaje: resultado.message,
      id_venta_cancelada: id
    });
  } catch (err: any) {
    next(err);
  }
}