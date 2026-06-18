import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/rol.middleware.js";
import { crearVenta, getSalesByUserReport, listarVentas, obtenerVentaId } from "../controllers/venta.controller.js";

const router: Router = Router();

// GET /ventas = listar todas las ventas
router.get('/', authenticateToken, authorizeRole('admin'), listarVentas);

// GET /ventas/:id = obtener una venta especifica por el ID
router.get('/:id', authenticateToken, obtenerVentaId);

// POST /ventas = crear una nueva venta
router.post('/', authenticateToken, crearVenta);

// GET /ventas/report-user = Reporte de venta por usuario
router.get('/report/user', authenticateToken, authorizeRole('admin'), getSalesByUserReport)

export default router;